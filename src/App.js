import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import russianMessages from 'ra-language-russian';
import { PostList, PostEdit, PostCreate } from './admin/Postlist';
import { ModelList, ModelEdit, ModelCreate } from './admin/Modellist';
import authProvider from './admin/AuthProvider';

import UserIcon from '@material-ui/icons/Group';
import { defaultMaterialTheme } from './admin/materialTheme';
import addUploadFeature from './admin/addUploadFeature';

const dataProvider = jsonServerProvider('https://my-json-server.typicode.com/Steelrover/React-admin-fakeapi');
const uploadCapableDataProvider = addUploadFeature(dataProvider);

const messages = { ru: russianMessages },
      i18nProvider = locale => messages[locale];


const App = () => (

  <Admin theme={defaultMaterialTheme} i18nProvider={i18nProvider} messages={messages} locale='ru' authProvider={authProvider} dataProvider={uploadCapableDataProvider}>
    <Resource name='posts' options={{ label: 'Публикации' }} list={PostList} edit={PostEdit} create={PostCreate}/>
    <Resource name='models' options={{ label: 'Модели' }} list={ModelList} edit={ModelEdit} create={ModelCreate} icon={UserIcon}/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
  </Admin>
)

export default App;
