import React from 'react';

import CollegiateSubredditsForm from 'main/components/CollegiateSubreddits/CollegiateSubredditsForm';
import { CollegiateSubredditsFixtures } from 'fixtures/CollegiateSubredditsFixtures';

export default {
    title: 'components/CollegiateSubreddits/CollegiateSubredditsForm',
    component: CollegiateSubredditsForm
};


const Template = (args) => {
    return (
        <CollegiateSubredditsForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    CollegiateSubreddits: CollegiateSubredditsFixtures.oneSubreddit,
    submitText: "",
    submitAction: () => { }
};
