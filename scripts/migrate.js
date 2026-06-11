// Run with: npm run db:migrate
// Requires POSTGRES_URL to be set in your environment

const { sql } = require('@vercel/postgres')
const fs = require('fs')
const path = require('path')

async function migrate() {
  const schema = fs.readFileSync(
    path.join(__dirname, '../src/lib/schema.sql'),
    'utf8'
  )
  await sql.query(schema)
  console.log('Migration complete')
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
