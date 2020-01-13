import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin} from 'antd';

import {goTo} from 'utils/history';
import {PATHS} from 'config';
import {selectIsLoading} from 'site/reducer';
import {useInjectAccountReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import PageContent from 'components/PageContent';

import {changeEmail} from 'account/actions';
import saga from 'account/sagas/changeEmail';


export default function ChangeEmail() {
  useInjectAccountReducer();
  useInjectSaga({ key: 'changeEmail', saga: saga });

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const [newEmail, setNewEmail] = useState("");

  // Not gonna declare event types here. No need. any is fine
  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const payload = {
      newEmail: newEmail,
    };
    dispatch(changeEmail.request(payload));
  };

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: '20px',
          }}
          title="Change Email"
          subTitle="Please enter a new email"
          onBack={goTo(PATHS.Settings)}
        />
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            <Input
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              type="email"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="New Email"
              autoComplete="on"
            />
          </Form.Item>
          <Button type="primary" size="default" htmlType="submit">
            Change Email
          </Button>
        </Form>
      </Spin>
    </PageContent>
  );
}
