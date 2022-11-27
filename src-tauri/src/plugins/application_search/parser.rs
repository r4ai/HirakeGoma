use crate::core::db::search_database_store::SearchDatabaseItem;
use crate::core::utils::path::{
    get_error_icon_path, get_project_data_dir, get_project_data_icons_dir,
};
use crate::core::utils::result::{CommandError, CommandResult};
use configparser::ini::Ini;
use lnk::ShellLink;
use log::{debug, error, trace};
use powershell_script::PsScriptBuilder;
use std::path::PathBuf;

/// .lnkファイルの情報を読み取る。
///
/// # Examples
///
/// ```
/// use std::path::PathBuf;
/// use std::env;
///
/// let lnk_file_name = "Zoom";
/// let lnk_file_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/resources/fake_data").join(lnk_file_name.clone());
///
/// let result = parse_lnk(&lnk_file_path).unwrap();
/// assert_eq!(lnk_file_name, result.name);
/// ```
pub fn parse_lnk(file_path: &PathBuf, debug: bool) -> Result<SearchDatabaseItem, lnk::Error> {
    let lnk_file_name = file_path.file_name().unwrap().to_str().unwrap().to_string();
    let lnk_file_path = file_path.to_str().unwrap().to_string();
    let lnk_file = ShellLink::open(&file_path)?;
    if debug {
        dbg!(lnk_file.icon_location());
    }
    let lnk_file_icon_path = lnk_file
        .icon_location()
        .clone()
        .unwrap_or(get_error_icon_path().to_str().unwrap().to_string());
    trace!("lnk_file_path: {}", &lnk_file_path);
    trace!("lnk_file_icon_path: {}", &lnk_file_icon_path);
    Ok(SearchDatabaseItem::new_app(
        lnk_file_name,
        lnk_file_icon_path,
        lnk_file_path,
    ))
}

/// .urlファイルの情報を読み取る。
pub fn parse_url(
    file_path: &PathBuf,
    debug: bool,
) -> Result<SearchDatabaseItem, Box<dyn std::error::Error>> {
    let mut config = Ini::new();
    let map = config.load(file_path)?;
    let file_icon_path = config
        .get("InternetShortcut", "IconFile")
        .unwrap_or(get_error_icon_path().to_str().unwrap().to_string());
    let file_name = file_path.file_name().unwrap().to_str().unwrap().to_string();
    if debug {
        dbg!(&file_icon_path, &file_name, &file_path);
    }
    trace!("url_file_path: {}", &file_path.to_str().unwrap());
    trace!("url_file_icon_path: {}", &file_icon_path);
    Ok(SearchDatabaseItem::new_app(
        file_name,
        file_icon_path,
        file_path.to_str().unwrap().to_string(),
    ))
}

pub fn parse_exe(file_path: &PathBuf) -> CommandResult<SearchDatabaseItem> {
    let file_stem = file_path.file_stem().unwrap();
    let target_file_path = match export_icon_from_exe(file_path, "png") {
        Ok(path) => path,
        Err(e) => return Err(e),
    };
    Ok(SearchDatabaseItem::new_app(
        file_stem.to_str().unwrap().to_string(),
        target_file_path.to_str().unwrap().to_string(),
        file_path.to_str().unwrap().to_string(),
    ))
}

/// Export icon file from .exe file.
///
/// ## args:
/// - `file_path`: path to the .exe file.
/// - `extension`: icon extension. Ex. png, bmp, ...
///
/// ## return:
/// - path to the icon file which was extracted from `file_path`.
fn export_icon_from_exe(exe_file_path: &PathBuf, icon_extension: &str) -> CommandResult<PathBuf> {
    let icons_dir = get_project_data_icons_dir()?;
    let file_stem = exe_file_path.file_stem().unwrap();
    let target_file_path = icons_dir.join(format!(
        "{}.{}",
        file_stem.to_str().unwrap(),
        icon_extension
    ));

    macro_rules! raw_script {
        () => {
            "\
            Add-Type -AssemblyName System.Drawing\n\
            $icon = [System.Drawing.Icon]::ExtractAssociatedIcon(\"{}\")\n\
            $icon.ToBitmap().Save(\"{}\")\
            "
        };
    }
    let powershell_script = format!(
        raw_script!(),
        exe_file_path.to_str().unwrap(),
        target_file_path.to_str().unwrap()
    );

    let ps = PsScriptBuilder::new()
        .no_profile(true)
        .non_interactive(true)
        .hidden(false)
        .print_commands(false)
        .build();
    match ps.run(powershell_script.as_str()) {
        Ok(o) => {
            debug!(
                "SUCCESS: extract icon to {} from {}",
                exe_file_path.to_str().unwrap(),
                target_file_path.to_str().unwrap()
            );
            return Ok(target_file_path);
        }
        Err(e) => {
            error!(
                "Failed to extract icon from {}",
                exe_file_path.to_str().unwrap()
            );
            return Err(CommandError::PowerShell(e));
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{env, path::PathBuf};

    use super::{parse_lnk, parse_url};
    use crate::core::utils::path::get_cargo_toml_dir;

    #[test]
    fn parse_lnk_test() {
        let lnk_file_name = "Zoom.lnk";
        let root_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let data_path = root_path.join("tests/resources/fake_data");
        let zoom_data_path = data_path.join(lnk_file_name);
        let parse_res = parse_lnk(&zoom_data_path, true).expect("Failed to parse .lnk file.");
        dbg!(&parse_res);
        assert_eq!(parse_res.name, lnk_file_name);
    }

    #[test]
    fn parse_url_test() {
        let path = get_cargo_toml_dir()
            .join("tests")
            .join("resources")
            .join("fake_data")
            .join("Arma 3.url");
        let res = parse_url(&path, true).unwrap();
        dbg!(&res);
        assert_eq!(path.to_str().unwrap().to_string(), res.path); // file path check
                                                                  // TODO: file_name check
                                                                  // TODO: file_icon_path check
    }
}
