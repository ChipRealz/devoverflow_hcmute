import { OrganizationSwitcher } from "@clerk/nextjs"

export const OrgSwitcher = () => {
    return (
        <div className="flex">
            <OrganizationSwitcher afterSelectOrganizationUrl="/moderator" defaultOpen={false} />
        </div>
    )
}