const hashedPassword = "$2a$14$qHqCbXUImiBOgXlFNX47wuA7uFWNGNAZutYLvOeye9eotewGlfYV6"

exports.seed = async function(knex) {
  await knex("users").insert([
    {id: 1, username: "Joshua Dunson", password: hashedPassword, department: "sales"}
  ])
}
