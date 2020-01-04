import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {PageHeader, Spin, Popconfirm, Button, Icon,
  Descriptions, Typography, Checkbox} from 'antd';
import _ from 'lodash';

import {useInjectAdminReducer} from 'utils/injectReducer';
import {useInjectMultipleSagas} from 'utils/injectSaga';
import PageContent from 'components/PageContent';
import {selectIsLoading} from 'site/reducer';
import {PATHS} from 'config';
import {goTo} from 'utils/history';

import {selectAdmin} from 'admin/reducer';
import fetchUsersSaga from 'admin/sagas/fetchUsers';
import deleteUserSaga from 'admin/sagas/deleteUser';
import updateUserSaga from 'admin/sagas/updateUser';
import {fetchUsers, deleteUser, updateUser} from 'admin/actions';
import {RoleTag, VerifiedEmailIcon} from 'admin/pages/ManageUsers/Tags';
import './style.scss';

const { Text } = Typography;

export default function ManageUser(props) {

  const dispatch = useDispatch();

  const adminState = useSelector(selectAdmin);
  const isLoading = useSelector(selectIsLoading);
  const users = adminState.users;
  const userID = props.match.params.userID;
  const user = _.has(users, userID) ? users[userID] : null;

  useInjectAdminReducer();
  useInjectMultipleSagas({ key: 'manageUser',
    sagas: [fetchUsersSaga, deleteUserSaga, updateUserSaga] });

  useEffect(() => {
    if (!user || adminState.stale) {
      dispatch(fetchUsers.request({ userID }));
    }
  }, []);

  const name = user ? `${user.firstName} ${user.lastName}` : '';
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);
  const [verifiedEmail, setVerifiedEmail] = useState<null | boolean>(null);
  const [changes, setChanges] = useState(false);
  const revertChanges = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setRole(user.role);
    setVerifiedEmail(user.verifiedEmail);
    setChanges(false);
  };
  const editable = (val, setVal) => editing && {
    onChange: (newVal) => {
      setVal(newVal);
      if (newVal !== val && !changes) { setChanges(true); }
    },
  };
  const verifiedEmailOnClick = () => {
    setVerifiedEmail(!(verifiedEmail != null ? verifiedEmail : user.verifiedEmail));
    setChanges(true);
  };
  const saveChanges = () => {
    const payload = {
      data: { firstName, lastName, email, role, verifiedEmail },
      userID,
      name,
    };
    dispatch(updateUser.request(payload));
    // Reset all values
    setEditing(false);
    setFirstName(null);
    setLastName(null);
    setEmail(null);
    setRole(null);
    setVerifiedEmail(null);
    setChanges(false);
  };

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={!user || isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          title={name}
          subTitle="Manage user"
          onBack={goTo(PATHS.ManageUsers)}
        />
        <Descriptions title="" column={1} bordered style={{margin: '25px 5px'}}>
          <Descriptions.Item label="First Name">
            {user && <Text editable={editable(user.firstName, setFirstName)}>
              {(editing && firstName != null) ? firstName : user.firstName}
            </Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {user && <Text editable={editable(user.lastName, setLastName)}>
              {(editing && lastName != null) ? lastName : user.lastName}
            </Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user && <Text editable={editable(user.email, setEmail)}>
              {(editing && email != null) ? email : user.email}
            </Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            {user && (editing ?
              <Text editable={editable(user.role, setRole)}>
                {role == null ? user.role : role}
              </Text> : <RoleTag role={user.role} />)}
          </Descriptions.Item>
          <Descriptions.Item label="Verified Email">
            {user && (editing ?
              <Checkbox checked={verifiedEmail == null ? user.verifiedEmail : verifiedEmail}
                        style={{marginRight: '8px'}}
                        onClick={() => verifiedEmailOnClick()} /> :
              <VerifiedEmailIcon verifiedEmail={user.verifiedEmail} />
            )}
          </Descriptions.Item>
        </Descriptions>
        <Popconfirm
          title="Are you sure delete this user? This cannot be undone."
          placement="bottom"
          onConfirm={() => dispatch(deleteUser.request({userID, name}))}
          onCancel={() => null}
          okText="Yes"
          okType="danger"
          cancelText="No"
          icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
        >
          <Button type="danger" style={{marginRight: '8px'}}>Delete</Button>
        </Popconfirm>
        {(editing && changes) ? <Button type="primary" onClick={() => saveChanges()}>
          Save
        </Button> : <Button type={editing ? 'primary' : 'ghost'} onClick={() => setEditing(!editing)}>
          {!editing ? 'Edit' : 'View Only'}
        </Button>}
        {editing && changes && <Button type="ghost" onClick={revertChanges} style={{marginLeft: '8px'}}>
          Revert Changes
        </Button>}
      </Spin>
    </PageContent>
  );
}
