import SectionTitle from './SectionTitle'

type Props = {
  children: React.ReactNode;
  sectionName: string;
  style?: string;
}

const SettingsSectionContainer = ({
  children,
  sectionName,
  style
}:Props) => {
  return (
    <div className={`bg-primary-light/7 dark:bg-gray-900 p-2 space-y-2 rounded-4xl border border-primary-middledark 
      ${style ?? ''}
    `}>
      <SectionTitle 
        title={sectionName}
      />
      {children}
    </div>
  )
}

export default SettingsSectionContainer;