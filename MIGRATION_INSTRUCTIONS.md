# Database Migration Instructions

## 1. Add Status Column to Listings

To enable the "Sold" and "Traded" status features, you need to run a database migration.

### Steps:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
-- Add status column
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Sold', 'Traded'));

-- Update existing listings to have 'Available' status
UPDATE listings
SET status = 'Available'
WHERE status IS NULL;

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
```

5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify the migration succeeded - you should see "Success. No rows returned"

### After Migration:

- The status field will be available in create/edit forms
- Listings can be marked as "Sold" or "Traded"
- Only "Available" listings will show in the marketplace
- The status badge will appear on listing detail pages

### Note:

Until you run this migration, the status feature will be disabled in the code to prevent errors. The app will work normally without it.

---

## 2. Add Location Column to Listings

To enable the location field for listings, run this migration:

### Steps:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
-- Add location column
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS location TEXT;

-- Create index for location filtering
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
```

5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify the migration succeeded

### After Migration:

- The location field will be available in create/edit forms
- Location will be displayed on listing detail pages
- You can filter/search by location in the future

---

## 3. Add Rent Fields to Listings

To enable the rent feature for listings, run this migration:

### Steps:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
-- Add rent_available and rent_price columns
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS rent_available BOOLEAN DEFAULT false;

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS rent_price DECIMAL(10, 2);
```

5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify the migration succeeded

### After Migration:

- The rent option will be available in create/edit forms
- Rent price will be displayed on listing cards and detail pages
- Users can mark listings as available for rent with a daily price

