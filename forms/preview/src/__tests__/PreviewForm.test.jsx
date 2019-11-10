import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import renderer from 'react-test-renderer';
/* eslint-enable import/no-extraneous-dependencies */
import { IntlProvider } from 'react-intl';
import { ComponentsCollection } from '@panneau/core';
import { ComponentsProvider } from '@panneau/core/contexts';

import * as FieldsComponents from '../../../../fields/fields/src/index';
import * as PreviewsComponents from '../../../../previews/previews/src/index';
import * as FormsComponents from '../../../forms/src/index';

import PreviewForm from '../PreviewForm';

const componentsCollection = new ComponentsCollection();
componentsCollection.addComponents(FieldsComponents, 'fields');
componentsCollection.addComponents(PreviewsComponents, 'previews');
componentsCollection.addComponents(FormsComponents, 'forms');

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
                <PreviewForm fields={fields} value={value} />
            </IntlProvider>
        </ComponentsProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
