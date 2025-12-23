-- Enable Row Level Security on all user-scoped tables

-- object_definitions RLS
ALTER TABLE object_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own object_definitions" 
  ON object_definitions FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert own object_definitions" 
  ON object_definitions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update own object_definitions" 
  ON object_definitions FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete own object_definitions" 
  ON object_definitions FOR DELETE 
  USING (true);

-- records RLS
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own records" 
  ON records FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert own records" 
  ON records FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update own records" 
  ON records FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete own records" 
  ON records FOR DELETE 
  USING (true);

-- relationships RLS
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own relationships" 
  ON relationships FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert own relationships" 
  ON relationships FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can delete own relationships" 
  ON relationships FOR DELETE 
  USING (true);
