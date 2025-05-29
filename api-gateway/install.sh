#!/bin/bash

echo "INASTALACIÓN DE COMPONENTES EN PROD"

BASEDIR=${PWD}
echo "Script location: ${BASEDIR}"

echo "Listado de carpetas node_modules a eliminar"
find . -name 'node_modules' -type d -prune

echo "Iniciando eliminación"
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

echo "############ Iniciando instalacion commonjs/sharedjs ############"
echo "Entrando a commonjs/sharedjs"
cd "${BASEDIR}/commonjs/sharedjs"
echo "Instanando en ${BASEDIR}/commonjs/sharedjs"
npm install --production
echo "Regresando a $BASEDIR"
cd $BASEDIR

echo "############ Iniciando instalacion commonjs/dynamodbjs ############"
echo "Entrando a commonjs/dynamodbjs"
cd "${BASEDIR}/commonjs/dynamodbjs"
echo "Instanando en ${BASEDIR}/commonjs/dynamodbjs"
npm install --production
echo "Regresando a $BASEDIR"
cd $BASEDIR

echo "############ Iniciando instalacion lambdas ############"
for i in $(ls -d lambdas/*); do 
    echo "Entrando a ${i%%/}"
    cd ${i%%/}
    echo "Instanando en ${i%%/}"
    npm install --production
    echo "Regresando a $BASEDIR"
    cd $BASEDIR
done

echo "############ iac ##############"

echo "############ init ##############"
terraform init
echo "############ validate ##############"
terraform validate
echo "############ plan ##############"
terraform plan
echo "############ apply ##############"
terraform apply -auto-approve
echo "############ fin ##############"
