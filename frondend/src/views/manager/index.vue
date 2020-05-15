<template>
  <b-container fluid>
    <b-row>
      <b-col cols="3">
      </b-col>
      <b-col cols="8">
        <router-view />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000/api'
});

export default {
  data() {
    return {
      schemas: {},
      schema: '',
      tables: [],
      table: ''
    };
  },
  mounted() {
    this.getSchemas()
      .then(data => { 
        const object = {};
        data.forEach(element => object[element] = [])
        return object;
        })
      .then(data => this.schemas = data)
      .catch(console.log)
  },
  methods: {
    getTables(schemaName) {
      return axiosInstance.get(`/tables/${schemaName}`)
      .then(response => response.data)
      .catch(console.log)
    },
    getTableDetails(schemaName, tablename) {
      return axiosInstance.get(`/table/${schemaName}/${tablename}`)
      .then(response => response.data)
      .catch(console.log)
    },
    getSchemas() {
      return axiosInstance.get('/schemas')
      .then(response => response.data)
      .catch(console.log)
    },
    getSchemaDetails(schemaName) {
      return axiosInstance.get(`/schema/${schemaName}`)
      .then(response => response.data)
      .catch(console.log)
    }
  }
};
</script>
