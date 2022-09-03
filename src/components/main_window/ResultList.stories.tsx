import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ResultList } from "./ResultList";
import { SearchResults } from "../../types/SearchResult";

const meta: ComponentMeta<typeof ResultList> = {
  title: "main_window/ResultList",
  component: ResultList
};
export default meta;

const searchResults: SearchResults = [
  { name: "fugafuga", id: "1", icon: "fuga.png", file_path: "fuga/hoge/foo.exe" },
  { name: "fugahoge", id: "2", icon: "bar.png", file_path: "fuga/hoge/foe.exe" }
];

const Template: ComponentStory<typeof ResultList> = (args) => <ResultList {...args} />;

export const Default = Template.bind({});
Default.args = {
  searchResults: [
    { name: "fugafuga", id: "1", icon: "fuga.png", file_path: "fuga/hoge/foo.exe" },
    { name: "fugahoge", id: "2", icon: "bar.png", file_path: "fuga/hoge/foe.exe" }
  ]
};
