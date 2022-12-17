use super::result::CommandResult;

pub enum Operator {
    Calculator,
    Command,
    ExplorerHome,
    Explorer,
    FileSearch,
    Terminal,
    WebSearch,
}

impl Operator {
    pub fn value(&self) -> CommandResult<String> {
        match self {
            &Operator::Calculator => "=",
            _ => todo!(),
        }
    }
}

pub fn parse() -> CommandResult<()> {
    Ok(())
}
