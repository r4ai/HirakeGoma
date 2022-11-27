use super::search_database_store::{
    DbSearchTrait, SearchDatabaseItem, SearchDatabaseStore, SearchDatabaseTable,
};
use kv::{Bucket, Json};
use tauri::State;

pub struct SearchDatabaseMainTable<'a> {
    pub bucket: Bucket<'a, String, Json<SearchDatabaseItem>>,
    pub name: String,
}

impl SearchDatabaseTable<'_, SearchDatabaseStore, SearchDatabaseItem>
    for SearchDatabaseMainTable<'_>
{
    fn access_to_bucket(&self) -> &Bucket<'_, String, Json<SearchDatabaseItem>> {
        &self.bucket
    }

    fn access_to_name(&self) -> &String {
        &self.name
    }

    fn init(store: State<'_, SearchDatabaseStore>) -> Self {
        let bucket: Bucket<String, Json<SearchDatabaseItem>> =
            store.store.bucket(Some("main")).unwrap();
        let name = String::from("SearchDatabaseMainTable");
        Self { bucket, name }
    }
}

impl DbSearchTrait for SearchDatabaseMainTable<'_> {
    fn access_to_bucket(&self) -> &Bucket<'_, String, Json<SearchDatabaseItem>> {
        &self.bucket
    }

    fn access_to_name(&self) -> &String {
        &self.name
    }
}
