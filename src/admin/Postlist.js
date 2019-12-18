import React, { Component } from 'react';
import { SimpleForm, 
        List, 
        Datagrid, 
        Edit, 
        Create, 
        TextField, 
        UrlField, 
        DateField, 
        ReferenceField, 
        ImageField, 
        FunctionField, 
        ReferenceInput,
        AutocompleteInput, 
        TextInput, 
        EditButton, 
        ImageInput, 
        Filter } from 'react-admin';
import { DateInput } from 'react-admin-date-inputs';
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import { withStyles } from '@material-ui/core/styles';

import ShowHideField from './ShowHideField';
import ShowHideBooleanInput from './ShowHideBooleanInput';
import ImageFieldDragList from './ImageFieldDragList';

import './Postlist.css';

DateFnsUtils.prototype.getStartOfMonth = DateFnsUtils.prototype.startOfMonth;

const styles = {}

const validatePost = (values, props, formType) => {
    const errors = {};
    console.log('Values for validating', values)
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!values.modelId) {
        errors.modelId = ['Пожалуйста, укажите имя'];
    }
    if (!values.dateAdd) {
        errors.dateAdd = ['Пожалуйста, укажите дату публикации'];
    } else if (values.dateAdd < today) {
        errors.dateAdd = ['Пожалуйста, укажите правильную дату публикации'];
    }
    if (!values.pictures) {
        errors.pictures = ['Пожалуйста, загрузите изображения'];
    }
    if (formType === 'edit' && !values.publicOrder[0] && !values.sourcePictures) {
        errors.sourcePictures = ['Должно быть загружено хотябы одно общедоступное изображение']
    }
    return errors
};

const PostFilter = (props) => (
    <Filter {...props}>
        {/*<ReferenceInput label="Имя модели" source="modelId" reference="models" alwaysOn allowEmpty >
                    <AutocompleteInput optionText="name" />
                </ReferenceInput>*/}
        <TextInput label="Поиск" source="q" alwaysOn resettable/>
    </Filter>
);

export const PostList = withStyles(styles)( ({ classes, ...props }) => {

    return (
        <List {...props} filters={<PostFilter />} title="Публикации" sort={{ field: 'dateAdd', order: 'DESC' }} exporter={false}>
            <Datagrid>
                <FunctionField className='coverField' 
                               label='Обложка' 
                               render={record => {
                                        const key = Object.keys(record.pictures)[0];
                                        return <img src={record.pictures[key].url}/>}}/>
                <TextField label='id' source="id"/>
                <ReferenceField label="Имя модели" source="modelId" reference="models">
                  <UrlField source="name" />
                </ReferenceField>
                <TextField label="id модели" source="modelId" />
                <DateField label="Дата публикации" source="dateAdd" locales="ru-RU"/>
                <TextField label="Просмотры" source="views" />
                <TextField label="Просмотры за неделю" source="viewsWeek" />
                <ShowHideField label="Статус" source="status" />
                <EditButton />
            </Datagrid>
        </List>
    )
});

class PostEditComponent extends Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        const { classes, ...props} = this.props;

        return(
            <Edit {...props}>
                <SimpleForm validate={(values, props) => validatePost(values, props, 'edit')} redirect="edit">
                    <ReferenceInput label="Имя модели" source="modelId" reference="models">
                      <AutocompleteInput label="Имя модели" source="name" />
                    </ReferenceInput>
                    <DateInput label="Дата публикации" source="dateAdd" 
                               options={{ format:"dd.MM.yyyy"}} 
                               providerOptions={{ utils: DateFnsUtils, locale: ruLocale }} />
                    <TextField label="Id модели" source="modelId" />
                    <ReferenceInput label="Показано" source="status" reference="posts">
                      <ShowHideBooleanInput label="Показано" labelOnFalse="Скрыто" source="status" />
                    </ReferenceInput>
                    <ImageInput source="sourcePictures" label="Загружаемые изображения" accept="image/*" multiple={true}>
                        <ImageField source="sourcePictures" />
                    </ImageInput>
                    <ImageFieldDragList fullWidth={true} label="Загруженные изображения" source="pictures" src="url" />
                </SimpleForm>
            </Edit>
        )
    }
}

export const PostEdit = withStyles(styles)(PostEditComponent);

export const PostCreate = props => (
    <Create {...props}>
        <SimpleForm validate={validatePost}>
            <ReferenceInput label="Имя модели" source="modelId" reference="models">
              <AutocompleteInput label="Имя модели" source="name" />
            </ReferenceInput>
            <DateInput label="Дата добавления" source="dateAdd" 
                       options={{ format:"dd.MM.yyyy"}} 
                       providerOptions={{ utils: DateFnsUtils, locale: ruLocale }}/>
            <ImageInput source="pictures" label="Загружаемые изображения" accept="image/*" multiple={true}>
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);
