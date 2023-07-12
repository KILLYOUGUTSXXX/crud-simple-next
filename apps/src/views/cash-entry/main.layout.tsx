'use client'

import React, { useState } from 'react'
import { Button, Form } from 'antd'
import TabComp, { ITabProps } from '@afx/components/tab-view'
import FormLayout from './form.layout'
import Controller from '@afx/controllers/cash-entry.controller'
import BrowseLayout from './browse.layout'

export default function Home() {
  const controllers = Controller()
  const { state, Main: controller } = controllers

  const TabSetting: ITabProps = {
    tabBarStyle: { color: '#8779C1', fontWeight: 'bold' },
    current: state.currentTab,
    tabs: [
      { children: <FormLayout controllers={controllers as any} />, label: 'Form', key: 'form' },
      { children: <BrowseLayout controllers={controllers as any} />, label: 'Browse', key: 'browse' }
    ],
    onChange: controller.onChangeTab
  }

  return (
    <div>
      <TabComp {...TabSetting}/>
    </div>
  )
}


