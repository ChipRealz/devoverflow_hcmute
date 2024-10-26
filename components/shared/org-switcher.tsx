import { OrganizationSwitcher } from "@clerk/nextjs"

export const OrgSwitcher = () => {
    return (
        <div className="flex">
            <OrganizationSwitcher afterSelectOrganizationUrl="/dashboard" defaultOpen={false} />
        </div>
    )
}