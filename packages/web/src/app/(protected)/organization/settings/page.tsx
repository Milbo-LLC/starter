"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Organization } from "better-auth/plugins"
import { authClient } from "@/lib/auth-client"
import { PageLayout } from "../../_components/page-layout"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function OrganizationPage() {
  const router = useRouter()
  const { data: organization } = authClient.useActiveOrganization()
  const { data: organizations } = authClient.useListOrganizations()
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Keep name in sync with active organization
  useEffect(() => {
    if (organization?.name) {
      setName(organization.name)
    }
  }, [organization?.name])

  if (!organization || !organizations) {
    return null
  }

  // Check if this is the personal organization (first organization)
  const isPersonalOrg = organizations[0]?.id === organization.id

  const hasChanges = name !== organization.name

  const handleSave = async () => {
    if (!hasChanges) return

    setIsLoading(true)
    setError(null)

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-")
      
      // Check if slug is available (skip if name hasn't changed)
      if (name !== organization.name) {
        const slugCheck = await authClient.organization.checkSlug({
          slug,
        })

        if (slugCheck.error) {
          setError(slugCheck.error.message || "This organization name is already taken")
          return
        }
      }

      await authClient.organization.update({
        organizationId: organization.id,
        data: {
          name,
          slug,
        }
      })

      // Refresh the data
      router.refresh()
    } catch (error) {
      setError("Failed to update organization")
      console.error("Failed to update organization:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      // Don't allow deleting personal organization
      if (isPersonalOrg) {
        console.error("Cannot delete personal organization")
        return
      }

      await authClient.organization.delete({
        organizationId: organization.id
      })

      // Find the first available organization that's not the one being deleted
      const nextOrg = organizations.find((org: Organization) => org.id !== organization.id)
      if (nextOrg) {
        await authClient.organization.setActive({
          organizationId: nextOrg.id
        })
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to delete organization:", error)
    }
  }

  return (
    <PageLayout showBackButton maxWidth="2xl" className="flex flex-col gap-6">
      <Card className="p-6 w-full">
        <h2 className="text-xl font-semibold mb-4">Organization Settings</h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Organization Name</Label>
            <div className="max-w-md">
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </div>
          </div>
          {isPersonalOrg && (
            <p className="text-sm text-muted-foreground">
              This is your personal organization and cannot be deleted.
            </p>
          )}
          <Separator />
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Save your changes to update the organization settings.
              </p>
              <Link 
                href="/organization/settings/members" 
                className="text-sm text-primary hover:underline"
              >
                Manage Team Members →
              </Link>
            </div>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || isLoading}
              size="lg"
            >
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Card>

      {!isPersonalOrg && (
        <Card className="p-6 border-destructive">
          <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
          <p className="text-muted-foreground mb-4">
            Once you delete an organization, there is no going back. Please be certain.
          </p>
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Organization
          </Button>
        </Card>
      )}
    </PageLayout>
  )
} 