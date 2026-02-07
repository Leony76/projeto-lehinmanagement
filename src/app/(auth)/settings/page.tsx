import { getUserSystemTheme } from "@/src/services/users"
import Settings from "./Settings"

export default async function SettingsPage() {

  const systemTheme = await getUserSystemTheme();

  const settings = {
    systemTheme: systemTheme,
  };

  return (
    <Settings
      settings={settings}
    />
  )
}

 