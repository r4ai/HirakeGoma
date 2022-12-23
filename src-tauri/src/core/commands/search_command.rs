use core::fmt;

use crate::core::{
    db::{
        commands_table::SearchDatabaseCommandsTable,
        main_table::SearchDatabaseMainTable,
        search_database_store::{DbSearchTrait, SearchDatabaseItem, SearchDatabaseTrait},
    },
    utils::result::CommandResult,
};
use log::{debug, info, trace};
use strum::{Display, EnumIter, EnumString, IntoEnumIterator};
use tauri::{AppHandle, Manager, State};

#[derive(Display, Debug, EnumString, EnumIter)]
enum Operator {
    #[strum(serialize = "=")]
    Calculator,
    #[strum(serialize = ".")]
    Command,
    #[strum(serialize = "~")]
    ExplorerHome,
    #[strum(serialize = "/")]
    Explorer,
    #[strum(serialize = "'")]
    FileSearch,
    #[strum(serialize = ">")]
    Terminal,
    #[strum(serialize = "?")]
    WebSearch,
}

struct ParseResult {
    operator: Option<Operator>,
    args: Vec<String>,
}

impl fmt::Debug for ParseResult {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "ParseResult: {{ operator: {:?}, args: {:?} }}",
            self.operator, self.args
        )
    }
}

fn parse_command(keyword: &String) -> ParseResult {
    info!("Parse keyword `{}`", keyword);
    let res = if keyword.is_empty() {
        ParseResult {
            operator: None,
            args: vec![],
        }
    } else {
        let first_keyword = String::from(keyword.chars().next().unwrap());
        let operator = Operator::iter().find(|x| x.to_string() == first_keyword);
        let args: Vec<String> = keyword
            .split(' ')
            .enumerate()
            .filter_map(|(i, e)| if i != 0 { Some(e.to_string()) } else { None })
            .collect();
        ParseResult { operator, args }
    };
    debug!("{:?}", &res);
    res
}

#[tauri::command]
pub fn search(
    app: AppHandle,
    main_table: State<'_, SearchDatabaseMainTable>,
    command_table: State<SearchDatabaseCommandsTable>,
    keyword: String,
    min_score: i64,
) -> Vec<SearchDatabaseItem> {
    let ParseResult { operator, args } = parse_command(&keyword);
    match operator {
        Some(Operator::Calculator) => todo!(),
        Some(_) => todo!(),
        None => {
            if args.is_empty() {
                main_table.search(&keyword, min_score)
            } else {
                let res = command_table.get(&args[0]);
                match res {
                    Ok(r) => {
                        todo!()
                    }
                    Err(_) => main_table.search(&keyword, min_score),
                }
            }
        }
    }
}
