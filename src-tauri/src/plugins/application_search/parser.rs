use crate::core::db::search_database_store::SearchDatabaseItem;
use crate::core::utils::path::{get_default_file_icon_path, get_project_data_icons_dir};
use crate::core::utils::result::{CommandError, CommandResult};
use configparser::ini::Ini;
use lnk::ShellLink;
use log::{debug, error, trace};
use powershell_script::PsScriptBuilder;
use std::path::PathBuf;
use tauri::AppHandle;

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
pub fn parse_lnk(app: AppHandle, file_path: &PathBuf) -> CommandResult<SearchDatabaseItem> {
    let lnk_file_name = file_path.file_stem().unwrap().to_str().unwrap().to_string();
    let lnk_file_path = file_path.to_str().unwrap().to_string();
    let lnk_file = match ShellLink::open(file_path) {
        Ok(s) => s,
        Err(e) => return Err(CommandError::Lnk(file_path.to_str().unwrap().to_string())),
    };

    let lnk_file_icon_path = get_icon_file_path(app.clone(), lnk_file.icon_location())?;

    Ok(SearchDatabaseItem::new_app(
        lnk_file_name,
        lnk_file_icon_path,
        lnk_file_path,
    ))
}

/// .urlファイルの情報を読み取る。
pub fn parse_url(
    app: AppHandle,
    file_path: &PathBuf,
) -> Result<SearchDatabaseItem, Box<dyn std::error::Error>> {
    let mut config = Ini::new();
    let map = config.load(file_path)?;

    let file_icon_path =
        get_icon_file_path(app.clone(), &config.get("InternetShortcut", "IconFile"))?;

    let file_stem = file_path.file_stem().unwrap().to_str().unwrap().to_string();
    trace!("url_file_path: {}", &file_path.to_str().unwrap());
    trace!("url_file_icon_path: {}", &file_icon_path);
    Ok(SearchDatabaseItem::new_app(
        file_stem,
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

pub fn parse_app(file_path: &PathBuf) -> CommandResult<SearchDatabaseItem> {
    let file_stem = file_path.file_stem().unwrap();
    let target_file_path = match export_icon_from_app(file_path, "png") {
        Ok(path) => path,
        Err(e) => return Err(e),
    };
    Ok(SearchDatabaseItem::new_app(
        file_stem.to_str().unwrap().to_string(),
        target_file_path.to_str().unwrap().to_string(),
        file_path.to_str().unwrap().to_string(),
    ))
}

fn get_icns_path(app_path: PathBuf) -> Option<PathBuf> {
    let resources_path = app_path.join("Contents/Resources");
    for entry in resources_path.read_dir().unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.extension().unwrap() == "icns" {
            return Some(path);
        };
    }
    None
}

fn convert_icns_to_png(icns_path: PathBuf, out_path: PathBuf) -> std::process::Output {
    std::process::Command::new("sips")
        .arg("-s")
        .arg("format")
        .arg("png")
        .arg(format!("{}", icns_path.display()))
        .arg("--out")
        .arg(format!("{}", out_path.display()))
        .output()
        .expect("Failed execute sips command")
}

fn get_icon_file_path(
    app: AppHandle,
    raw_icon_file_path: &Option<String>,
) -> CommandResult<String> {
    let default_file_icon_path = get_default_file_icon_path(app.clone())
        .to_str()
        .unwrap()
        .to_string();
    let raw_icon_file_path = match raw_icon_file_path {
        Some(p) => p,
        None => &default_file_icon_path,
    };
    // TODO: IMPORTANT! DELETE BELOW warn!
    debug!("raw_icon_file_path: {}", &raw_icon_file_path);

    let icon_extension = match PathBuf::from(&raw_icon_file_path).extension() {
        Some(ext) => ext.to_str().unwrap().to_string(),
        None => String::from(""),
    };

    let file_icon_path = match icon_extension.as_str() {
        "exe" => export_icon_from_exe(&PathBuf::from(&raw_icon_file_path), "png")?
            .to_str()
            .unwrap()
            .to_string(),
        "" => raw_icon_file_path.to_owned(),
        _ => raw_icon_file_path.to_owned(),
    };
    Ok(file_icon_path)
}

fn export_icon_from_app(app_file_path: &PathBuf, icon_extension: &str) -> CommandResult<PathBuf> {
    let icns_path = get_icns_path(app_file_path.clone()).unwrap();
    let target_icon_path = get_project_data_icons_dir()?.join(format!(
        "{}.{}",
        app_file_path.file_stem().unwrap().to_str().unwrap(),
        icon_extension
    ));
    let std_out = convert_icns_to_png(icns_path, target_icon_path);
    if std_out.stderr.len() != 0 {
        return Err(CommandError::App(
            icns_path.file_stem().unwrap().to_str().unwrap().to_string(),
            String::from(String::from_utf8(std_out.stderr).unwrap()),
        ));
    };
    Ok(target_icon_path)
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
            $ErrorActionPreference = \"Continue\"\n\
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
                "Extracted icon to {} from {}",
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
