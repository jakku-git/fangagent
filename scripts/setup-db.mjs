import pg from "pg";
const { Client } = pg;

// Supabase direct DB connection string
// Format: postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
// We'll construct it from the project ref
const PROJECT_REF = "ljbajzpevhwgtkpdcllf";
const DB_PASSWORD = process.argv[2];

if (!DB_PASSWORD) {
  console.error("Usage: node scripts/setup-db.mjs <database-password>");
  console.error("Find your DB password in Supabase → Project Settings → Database → Connection string");
  process.exit(1);
}

const connectionString = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres`;

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

const statements = [
  {
    name: "create get_my_role function",
    sql: `
      create or replace function public.get_my_role()
      returns text language sql stable security definer as $$
        select role from public.profiles where id = auth.uid()
      $$;
    `,
  },
  { name: "drop old profiles policies", sql: `
    drop policy if exists "staff_read_all_profiles" on public.profiles;
    drop policy if exists "staff_update_profiles" on public.profiles;
    drop policy if exists "agent_own_profile" on public.profiles;
  `},
  { name: "create profiles policy", sql: `create policy "profiles_access" on public.profiles for all using (auth.uid() = id or public.get_my_role() = 'staff');` },
  { name: "drop old listings policies", sql: `drop policy if exists "agent_own_listings" on public.listings; drop policy if exists "staff_all_listings" on public.listings;` },
  { name: "create listings policy", sql: `create policy "listings_access" on public.listings for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');` },
  { name: "drop old invoices policies", sql: `drop policy if exists "agent_own_invoices" on public.invoices; drop policy if exists "staff_all_invoices" on public.invoices;` },
  { name: "create invoices policy", sql: `create policy "invoices_access" on public.invoices for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');` },
  { name: "drop old remittances policies", sql: `drop policy if exists "agent_own_remittances" on public.remittances; drop policy if exists "staff_all_remittances" on public.remittances;` },
  { name: "create remittances policy", sql: `create policy "remittances_access" on public.remittances for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');` },
  { name: "drop old crm policies", sql: `drop policy if exists "agent_own_crm" on public.crm_requests; drop policy if exists "staff_all_crm" on public.crm_requests;` },
  { name: "create crm policy", sql: `create policy "crm_requests_access" on public.crm_requests for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');` },
  { name: "drop old credit policies", sql: `drop policy if exists "agent_own_credit" on public.credit_applications; drop policy if exists "staff_all_credit" on public.credit_applications;` },
  { name: "create credit policy", sql: `create policy "credit_applications_access" on public.credit_applications for all using (agent_id = auth.uid() or public.get_my_role() = 'staff');` },
  { name: "drop old photos policies", sql: `drop policy if exists "agent_own_photos" on public.listing_photos; drop policy if exists "staff_all_photos" on public.listing_photos;` },
  { name: "create photos policy", sql: `create policy "photos_access" on public.listing_photos for all using (exists (select 1 from public.listings l where l.id = listing_id and l.agent_id = auth.uid()) or public.get_my_role() = 'staff');` },
  { name: "set jack.li as staff", sql: `
    insert into public.profiles (id, role, full_name)
    select id, 'staff', 'Jack Li' from auth.users where email = 'jack.li@fang.com.au'
    on conflict (id) do update set role = 'staff', full_name = 'Jack Li';
  `},
];

try {
  await client.connect();
  console.log("✓ Connected to database\n");

  for (const stmt of statements) {
    try {
      await client.query(stmt.sql);
      console.log(`✓ ${stmt.name}`);
    } catch (err) {
      console.error(`✗ ${stmt.name}: ${err.message}`);
    }
  }

  console.log("\n✓ Done. You can now log in.");
} catch (err) {
  console.error("Connection failed:", err.message);
  console.error("\nMake sure you're using the correct DB password from:");
  console.error("Supabase → Project Settings → Database → Connection string");
} finally {
  await client.end();
}
