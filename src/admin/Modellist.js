import React from 'react';
import {  
         TabbedForm, 
         FormTab, 
         List,
         Edit, 
         Create, 
         Datagrid, 
         TextField, 
         ImageField, 
         ReferenceInput, 
         TextInput, 
         LongTextInput, 
         NumberInput, 
         AutocompleteInput, 
         EditButton, 
         ImageInput, 
         Filter } from 'react-admin';

const ModelFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Поиск" source="q" alwaysOn resettable/>
    </Filter>
);

const validateModelCreation = (values) => {
    const errors = {};
    if (!values.name) {
        errors.name = ['Пожалуйста, укажите имя'];
    }
    if (values.age < 18) {
        errors.age = ['Возраст должен быть больше или равен 18'];
    }
    if (values.height && values.height < 1) {
        errors.height = ['Рост должен быть больше 0'];
    }
    if (values.weight && values.weight < 1) {
        errors.weight = ['Вес должен быть больше 0'];
    }
    if (!values.modelAvatar) {
        errors.modelAvatar = ['Пожалуйста, загрузите аватар'];
    }
    // if (!values.bio) {
    //     errors.bio = ['Пожалуйста, заполните биографию модели'];
    // }
    return errors
};

export const ModelList = ({ classes, ...props }) => {

    return (
        <List {...props} filters={<ModelFilter />} classes={classes} title="Модели" exporter={false} >
            <Datagrid classes={classes}>
                <ImageField label="Аватар" className='coverField' source="modelAvatar"/>
                <TextField label="Имя модели" source="name" />
                <TextField label="id модели" source="id" />
                <EditButton />
            </Datagrid>
        </List>
    )
};

export const ModelEdit = props => (
    <Edit {...props}>
        <TabbedForm validate={validateModelCreation} redirect='edit'>
            <FormTab label="Основное" >
                <ImageField label="Аватар модели" source="modelAvatar"/>
                <ReferenceInput label="Имя модели" source="id" reference="models">
                  <AutocompleteInput label="Имя модели" source="name" />
                </ReferenceInput>
                <TextField label="id модели" source="id" />
                <ImageInput source="modelAvatar" label="Заменить аватар модели" accept="image/*" multiple={false}>
                    <ImageField source="modelAvatar" />
                </ImageInput>
                <span className="avatarWarning">При загрузке и сохранении нового аватара - старый аватар будет удален.</span>
            </FormTab>
            <FormTab label="Параметры">
                <NumberInput label="Возраст" source="age" />
                <NumberInput label="Вес" source="weight" />
                <NumberInput label="Рост" source="height" />
                <TextInput label="Национальность" source="nationality" />
                <TextField label="Релизы" source="releases" />
                <LongTextInput label="Биография" source="bio" />
            </FormTab>
        </TabbedForm>
    </Edit>
);

export const ModelCreate = props => (
    <Create {...props}>
        <TabbedForm validate={validateModelCreation}>
            <FormTab label="Основное">
                <TextInput label="Имя модели" source="name" />
                <ImageInput source="modelAvatar" label="Загрузить аватар модели" accept="image/*" multiple={false}>
                    <ImageField source="modelAvatar" />
                </ImageInput>
            </FormTab>
            <FormTab label="Параметры">
                <NumberInput label="Возраст" source="age" />
                <NumberInput label="Вес" source="weight" />
                <NumberInput label="Рост" source="height" />
                <TextInput label="Национальность" source="nationality" />
                <LongTextInput label="Биография" source="bio" />
            </FormTab>
        </TabbedForm>
    </Create>
);
