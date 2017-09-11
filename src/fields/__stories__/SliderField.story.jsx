import React from 'react';
import { action } from '@storybook/addon-actions';// eslint-disable-line import/no-extraneous-dependencies

import storiesOf from '../../../.storybook/storiesOf';
import SliderField from '../SliderField';
import KeepValue from '../../../.storybook/KeepValue';

storiesOf('Fields/Slider', module)
    .add('simple', () => (
        <div>
            <KeepValue>
                <SliderField
                    label="Label"
                    value={50}
                    onChange={action('change')}
                />
            </KeepValue>
        </div>

    ))
    .add('range', () => (
        <div>
            <KeepValue>
                <SliderField
                    label="Label"
                    value={[50, 60, 70]}
                    range
                    onChange={action('change')}
                />
            </KeepValue>
        </div>

    ));
