import { defineDb, defineTable, column } from 'astro:db';

const Clients = defineTable({
  columns: {
    id:column.number({primaryKey: true, autoIncrement: true}),
    name: column.text(),
    age: column.number(),
    isActivate: column.boolean(),
  }
});

const Post = defineDb({
  columns: {
    id: column.text({primayKey: true}),
    title: column.text(),
    likes: column.number()
  }
})


// https://astro.build/db/config
export default defineDb({
  tables: {
    Clients,
    Post,
  }
});
