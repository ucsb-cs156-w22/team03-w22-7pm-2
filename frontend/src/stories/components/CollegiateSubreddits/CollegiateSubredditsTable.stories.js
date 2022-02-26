import React from 'react';

import CollegiateSubredditsTable from "main/components/CollegiateSubreddits/CollegiateSubredditsTable";
import { CollegiateSubredditsFixtures } from 'fixtures/CollegiateSubredditsFixtures';

export default {
    title: 'components/CollegiateSubreddits/CollegiateSubredditsTable',
    component: CollegiateSubredditsTable
};

const Template = (args) => {
    return (
        <CollegiateSubredditsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    subreddit: []
};

export const threeSubreddits = Template.bind({});

threeSubreddits.args = {
    subreddit: CollegiateSubredditsFixtures.threeSubreddits
};


