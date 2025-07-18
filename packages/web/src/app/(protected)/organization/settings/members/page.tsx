"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { PageLayout } from "../../../_components/page-layout"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

type Role = "owner" | "admin" | "member"

export default function TeamMembersPage() {
  const router = useRouter()
  const { data: organization } = authClient.useActiveOrganization()
  const [activeMember, setActiveMember] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch active member
  useEffect(() => {
    const fetchActiveMember = async () => {
      try {
        const member = await authClient.organization.getActiveMember()
        setActiveMember(member)
      } catch (error) {
        console.error("Failed to fetch active member:", error)
      }
    }

    if (organization) {
      fetchActiveMember()
    }
  }, [organization])

  if (!organization || !activeMember) {
    return null
  }

  const handleInvite = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await authClient.organization.inviteMember({
        email,
        role: "member" as Role,
        // Optional: if you want to resend invitation if one already exists
        resend: true
      })

      // Clear the form
      setEmail("")
      
      // Refresh the data
      router.refresh()
    } catch (error) {
      setError("Failed to send invitation")
      console.error("Failed to send invitation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (memberIdOrEmail: string) => {
    try {
      await authClient.organization.removeMember({
        memberIdOrEmail,
        // organizationId is optional, it will use the active organization by default
      })

      // Refresh the data
      router.refresh()
    } catch (error) {
      console.error("Failed to remove member:", error)
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: Role) => {
    try {
      await authClient.organization.updateMemberRole({
        memberId,
        role: newRole
      })

      // Refresh the data
      router.refresh()
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await authClient.organization.cancelInvitation({
        invitationId
      })

      // Refresh the data
      router.refresh()
    } catch (error) {
      console.error("Failed to cancel invitation:", error)
    }
  }

  const handleLeaveOrganization = async () => {
    try {
      await authClient.organization.leave({
        organizationId: organization.id
      })

      // Redirect to dashboard after leaving
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to leave organization:", error)
    }
  }

  const isOwner = activeMember.data.role === "owner"
  
  const pendingInvitations = organization.invitations?.filter(invitation => invitation.status === "pending") ?? []

  return (
    <PageLayout showBackButton maxWidth="2xl" className="flex flex-col gap-6">
      <Card className="p-6 w-full">
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="space-y-6">
          {isOwner && (
            <div>
              <Label htmlFor="email">Invite Team Member</Label>
              <div className="flex gap-2 max-w-md">
                <Input 
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleInvite}
                  disabled={!email || isLoading}
                >
                  {isLoading ? "Sending..." : "Send Invite"}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </div>
          )}

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Current Members</h3>
            <div className="space-y-4">
              {organization.members?.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{member.user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role === "owner" ? "Owner" : member.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner && member.id !== activeMember.id && (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Change Role
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "owner")}>
                              Transfer Ownership
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "admin")}>
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "member")}>
                              Make Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove
                        </Button>
                      </>
                    )}
                    {member.id === activeMember.id && !isOwner && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleLeaveOrganization}
                      >
                        Leave Organization
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pendingInvitations.length > 0 && isOwner && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-4">Pending Invitations</h3>
                <div className="space-y-4">
                  {pendingInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Invited {new Date(invitation.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelInvitation(invitation.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </PageLayout>
  )
} 