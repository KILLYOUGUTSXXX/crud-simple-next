import { Tabs, TabPaneProps } from 'antd'
import { CSSProperties } from 'react'

const TabPane = Tabs.TabPane

export interface ITabItems extends Omit<TabPaneProps, 'tab'> {
  key: string;
  label: React.ReactNode;
}

export interface ITabProps {
  tabs: ITabItems[],
  current: string
  style?: CSSProperties | undefined,
  tabBarStyle?: CSSProperties | undefined,
  onChange: (key: string) => void | undefined
}

export default (props: ITabProps) => {
  return (
    <Tabs
      size="small"
      activeKey={props.current}
      style={props.style}
      tabBarStyle={props.tabBarStyle}
      onChange={props.onChange}
      items={props.tabs}
    />
  )
}