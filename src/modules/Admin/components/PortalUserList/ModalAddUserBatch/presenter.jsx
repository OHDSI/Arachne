/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin
 * Created: May 28, 2018
 *
 */

import React from 'react';
import { Button, Modal, Form, Fieldset, FormInput, FormCheckbox, FormError, FormSelect, FormAutocomplete, Table, TableCellText as CellText } from 'arachne-ui-components';
import StatefulFormAutocomplete from 'components/StatefulFormAutocomplete';
import { Field, FieldArray } from 'redux-form';
import BEMHelper from 'services/BemHelper';
import { registerFields } from 'modules/Auth/const';

require('./style.scss');

const fieldArrayName = 'users';

function CellTextEditable({ value, header, field, index, required = false }) {
  return (
    <Field
      component={Fieldset}
      name={`${fieldArrayName}[${index}].${field}`}
      InputComponent={{
        component: FormInput,
        props: {
          mods: ['rounded', 'bordered'],
          type: 'text',
          placeholder: header,
          required,
        }
      }}
    />
  );
}

function CellSelectEditable({ options, header, field, index, required = false }) {
  return (
    <Field
      component={Fieldset}
      name={`${fieldArrayName}[${index}].${field}`}
      InputComponent={{
        component: FormSelect,
        props: {
          mods: ['rounded', 'bordered'],
          placeholder: header,
          options,
          required,
        }
      }}
    />
  );
}

function CellAutocomplete({ header, field, index, required = false, tethered = false, options, fetchOptions }) {
  return (
    <Field
      component={Fieldset}
      name={`${fieldArrayName}[${index}].${field}`}
      InputComponent={{
        component: StatefulFormAutocomplete,
        props: {
          mods: ['rounded', 'bordered'],
          placeholder: header + (required ? '*' : ''),
          options,
          fetchOptions: (data) => {
            return fetchOptions({ ...data, rowDataKey: `${fieldArrayName}[${index}]` });
          },
          clearable: false,
          tethered,
        }
      }}
    />
  );
}

function LabeledField({ label, name, InputComponent }){
  const classes = new BEMHelper('admin-panel-batch-users-common-field');

  return (
    <div {...classes()}>
      <label {...classes('label')}>{label}</label>
      <div {...classes('field')}>
        <Field
          component={Fieldset}
          name={ name }
          InputComponent={ InputComponent }
        >
        </Field>
      </div>
    </div>
  );
}

function TenantSelect({ tenantOptions }) {

  return LabeledField({
    label: 'Tenant',
    name: 'tenantIds',
    InputComponent: {
      component: FormSelect,
      props: {
        mods: ['rounded', 'bordered'],
        placeholder: 'Tenants',
        options: tenantOptions,
        isMulti: true,
        required: true,
      }
    },
  });
}

function PasswordInput({ tenantOptions }) {

  return LabeledField({
    label: 'Password',
    name: 'password',
    InputComponent: {
      component: FormInput,
      props: {
        mods: ['rounded', 'bordered'],
        placeholder: 'Password',
        type: "password",
        required: true,
      }
    },
  })
}

function EmailCheckbox({ }) {

  return LabeledField({
    label: 'Email confirm',
    name: 'emailConfirmationRequired',
    InputComponent: {
      component: FormCheckbox,
      props: {
        mods: ['bordered'],
        placeholder: 'Require',
        options: {
          label: 'Send email confirmation',
        },
      },
    },
  });
}

function RemoveRow({ removeUser, index }) {
  const classes = new BEMHelper('admin-panel-batch-users-remove');

  return (
    <Button {...classes()} onClick={() => removeUser(index)}>close</Button>
  )
}

function UsersTable({ fields, meta: { touched, error }, professionalTypesOptions, countryProps, provinceProps, setFields }) {
  const classes = new BEMHelper('admin-panel-batch-users');
  setFields(fields);

  return (
    <div {...classes()}>
      <Table  {...classes('table')} data={fields}>
        <CellTextEditable {...classes('col-first-name')}
          header="First Name"
          field="firstname"
          props={() => ({
            required: true,
          })}
        />
        <CellTextEditable {...classes('col-last-name')}
          header="Last Name"
          field="lastname"
          props={() => ({
            required: true,
          })}
        />
        <CellTextEditable {...classes('col-email')}
          header="Email"
          field="email"
          props={() => ({
            required: true,
          })}
        />
        <CellSelectEditable {...classes('col-prof-type')}
          header="Prof. type"
          field="professionalTypeId"
          props={() => ({
            options: professionalTypesOptions,
            required: true,
          })}
        />
        <CellTextEditable {...classes('col-org')}
          header="Organization"
          field="organization"
          props={() => ({
            required: true,
          })}
        />
        <CellTextEditable {...classes('col-mobile')}
          header="Mobile"
          field="address.mobile"
          props={() => ({
            required: false,
          })}
        />
        <CellTextEditable {...classes('col-address')}
          header="Address"
          field="address.address1"
          props={() => ({
            required: true,
          })}
        />
        <CellTextEditable {...classes('col-city')}
          header="City"
          field="address.city"
          props={() => ({
            required: true,
          })}
        />
        <CellTextEditable {...classes('col-zip')}
          header="Zip code"
          field="address.zipCode"
          props={() => ({
            required: true,
          })}
        />
        <CellAutocomplete  {...classes('col-country')}
          header="Country"
          field="address.country.isoCode"
          props={() => ({
            required: true,
            tethered: true,
            options: countryProps.countries,
            fetchOptions: countryProps.searchCountries,
          })}
        />
        <CellAutocomplete  {...classes('col-province')}
          header="Province"
          field="address.stateProvince.isoCode"
          props={() => ({
            required: false,
            tethered: true,
            options: provinceProps.provinces,
            fetchOptions: provinceProps.searchProvinces,
          })}
        />
        <RemoveRow {...classes('col-remove')} props={() => ({
          removeUser: fields.remove,
        })} />
      </Table>
      
    </div>
  );
}

function ModalAddUserBatch(props) {
  const classes = new BEMHelper('admin-panel-modal-batch-users');
  const {
    addUser,
    fields,
    doSubmit,
    handleSubmit,
    professionalTypesOptions,
    removeUser,
    tenantOptions,
    countries,
    searchCountries,
    storeCountry,
    provinces,
    searchProvinces,
    storeProvince,
  } = props;

  const submitBtn = {
    label: 'Add',
    loadingLabel: 'Adding...',
    mods: ['success', 'rounded'],
  }

  const cancelBtn = {
    label: 'Cancel',
  }

  const ref = {};

  const countryProps = { countries, searchCountries };
  const provinceProps = { provinces, searchProvinces };

  return (
    <Modal modal={props.modal} title="Add users" mods={['no-padding']}>
      <div {...classes()}>
        <form
          onSubmit={handleSubmit(doSubmit)}
        >
          <FieldArray
            name={fieldArrayName}
            component={UsersTable}
            professionalTypesOptions={professionalTypesOptions}
            countryProps={countryProps}
            provinceProps={provinceProps}
            setFields={(fields) => ref.fields = fields}
          />
          <div {...classes('shared-field-list')}>
            <TenantSelect tenantOptions={tenantOptions} />
            <PasswordInput />
            <EmailCheckbox />
          </div>
          {(!props.pristine && props.error) ? 
            <FormError error={props.error} />
            : null
          }
          <div {...classes('btn-bar')}>
            <Button
              {...classes('add-btn')}
              onClick={() => ref.fields.push()}
            >
              <span {...classes('add-btn-ico')}>add_circle_outline</span>
              <span {...classes('add-btn-label')}>Add user</span>
            </Button>
            <Button
              {...classes('submit')}
              mods={['submit', 'success', 'rounded']}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>        
      </div>
    </Modal>
  );
}

export default ModalAddUserBatch;