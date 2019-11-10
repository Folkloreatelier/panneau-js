import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import renderer from 'react-test-renderer';
/* eslint-enable import/no-extraneous-dependencies */
import { IntlProvider } from 'react-intl';
import { ComponentsCollection } from '@panneau/core';
import { ComponentsProvider } from '@panneau/core/contexts';
import * as FieldsComponents from '@panneau/fields';

import NormalForm from '../NormalForm';

const componentsCollection = new ComponentsCollection();
componentsCollection.addComponents(FieldsComponents, 'fields');

const fields = [
    {
        type: 'text',
        label: 'Text',
        name: 'text',
    },
];

const value = {
    text: 'Text',
};

test('match snapshot', () => {
    const component = renderer.create(
        <ComponentsProvider collection={componentsCollection}>
            <IntlProvider locale="en">
                <NormalForm fields={fields} value={value} />
            </IntlProvider>
        </ComponentsProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
