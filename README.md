# authServiceGql

# Install

```shell
yarn install
knex migrate:latest
knex seed:run
yarn dev
```

**Playground**

http://localhost:3000

```graphql
query hello($name: String!){
  hello(name:$name)
}
```
