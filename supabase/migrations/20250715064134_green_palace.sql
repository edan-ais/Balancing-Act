/*
  # User Profiles and Tasks Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `selected_tabs` (jsonb array of selected tab IDs)
      - `current_theme` (text, theme ID)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `title` (text, task title)
      - `category` (text, task category)
      - `completed` (boolean, completion status)
      - `is_habit` (boolean, whether it's a habit)
      - `habit_count` (integer, current habit progress)
      - `habit_goal` (integer, habit target)
      - `priority` (text, priority level)
      - `custom_priority_text` (text, custom priority label)
      - `custom_priority_color` (text, custom priority color)
      - `goal_type` (text, goal classification)
      - `custom_goal_type_text` (text, custom goal label)
      - `custom_goal_type_color` (text, custom goal color)
      - `meal_type` (text, meal category)
      - `day_of_week` (text, scheduled day)
      - `notes` (text, additional notes)
      - `frequency` (text, cleaning frequency)
      - `cleaning_location` (text, cleaning area)
      - `custom_cleaning_location` (text, custom location)
      - `custom_cleaning_location_color` (text, custom location color)
      - `self_care_type` (text, self-care category)
      - `delegated_to` (text, person delegated to)
      - `delegate_type` (text, delegation category)
      - `reminder_enabled` (boolean, reminder setting)
      - `scheduled_date` (timestamptz, scheduled date)
      - `subtasks` (jsonb, array of subtasks)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own data
    - Automatic user_id assignment for tasks
</sql>

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_tabs jsonb DEFAULT '["index", "goals", "weekly", "meal-prep", "cleaning", "self-care", "delegation"]'::jsonb,
  current_theme text DEFAULT 'balance',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  completed boolean DEFAULT false,
  is_habit boolean DEFAULT false,
  habit_count integer DEFAULT 0,
  habit_goal integer,
  priority text,
  custom_priority_text text,
  custom_priority_color text,
  goal_type text,
  custom_goal_type_text text,
  custom_goal_type_color text,
  meal_type text,
  day_of_week text,
  notes text,
  frequency text,
  cleaning_location text,
  custom_cleaning_location text,
  custom_cleaning_location_color text,
  self_care_type text,
  delegated_to text,
  delegate_type text,
  reminder_enabled boolean DEFAULT false,
  scheduled_date timestamptz,
  subtasks jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policies for tasks
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();