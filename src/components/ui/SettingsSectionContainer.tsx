import SectionTitle from './SectionTitle'

type Props = {
  children: React.ReactNode;
  sectionName: string;
}

const SettingsSectionContainer = ({
  children,
  sectionName,
}:Props) => {
  return (
    <div className="bg-primary-light/7 dark:bg-gray-900 p-2 space-y-2 rounded-4xl border border-primary-middledark">
      <SectionTitle 
        title={sectionName}
      />
      {children}
    </div>
  )
}

export default SettingsSectionContainer;