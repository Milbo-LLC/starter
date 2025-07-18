"use client"

import { CreateOrganizationForm } from "../../_components/create-organization-form"
import { PageLayout } from "../../_components/page-layout"


export default function NewOrganizationPage() {
  return (
    <PageLayout showBackButton maxWidth="2xl">
      <CreateOrganizationForm className="w-full"/>
    </PageLayout>
  )
} 