import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import { InputBox } from "./InputBox";

const meta: ComponentMeta<typeof InputBox> = {
  title: "main_window/InputBox",
  component: InputBox
};

export default meta;

const Template: ComponentStory<typeof InputBox> = (args) => <InputBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: "AfterEffects"
};

export const Empty = Template.bind({});
Empty.args = {
  text: ""
};
