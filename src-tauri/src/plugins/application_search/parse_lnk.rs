use lnk::ShellLink;
use std::io::Error;
use std::path::Path;

pub fn parse_lnk(file_path: &Path) {
    let mut result = {};
    let lnk_file = ShellLink::open(file_path).expect("failed to load .lnk file");
    if let Some(name) = lnk_file.name() {
        dbg!(name);
    }
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use super::parse_lnk;

    #[test]
    fn parse_lnk_test() {
        parse_lnk(Path::new(
            r"C:\Users\e4zy9\source\repos\e9716\HirakeGoma\test\data\Zoom.lnk",
        ));
    }
}
