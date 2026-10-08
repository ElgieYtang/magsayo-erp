import { SETUP_FORM_FIELDS } from '@/config/setupFormFields'
import { useSetupResource } from '@/hooks/useSetupResource'
import { SetupListPage } from '@/pages/setup/SetupListPage'

function formatCustomerTerms(customer) {
  if (!customer.terms) return '—'
  return customer.termsType ? `${customer.terms} ${customer.termsType}` : customer.terms
}

export function UserSetupPage() {
  const users = useSetupResource('users')
  const positions = useSetupResource('positions')

  return (
    <SetupListPage
      title="User Setup"
      description="System users stored in setup_users."
      breadcrumbs={['Setup', 'User']}
      actionLabel="+ Add User"
      searchPlaceholder="Search user..."
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.users}
      rows={users.rows}
      loading={users.loading}
      loadError={users.error}
      optionSources={{ positions: positions.rows }}
      onAdd={users.add}
      onEdit={users.edit}
      onDelete={users.remove}
      columns={[
        { key: 'id', label: 'User ID' },
        { key: 'name', label: 'Name' },
        { key: 'username', label: 'Username' },
        { key: 'type', label: 'Type' },
        { key: 'position', label: 'Position' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function CompanySetupPage() {
  const companies = useSetupResource('companies')

  return (
    <SetupListPage
      title="Company Setup"
      description="Companies used on documents and branches."
      breadcrumbs={['Setup', 'Company']}
      actionLabel="+ Add Company"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.companies}
      rows={companies.rows}
      loading={companies.loading}
      loadError={companies.error}
      onAdd={companies.add}
      onEdit={companies.edit}
      onDelete={companies.remove}
      columns={[
        { key: 'name', label: 'Company Name' },
        { key: 'address', label: 'Address' },
        { key: 'contactNo', label: 'Contact No.' },
        { key: 'tinNo', label: 'TIN' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function BranchSetupPage() {
  const branches = useSetupResource('branches')
  const companies = useSetupResource('companies')

  return (
    <SetupListPage
      title="Branch Setup"
      description="Manage company branches."
      breadcrumbs={['Setup', 'Branch Setup']}
      actionLabel="+ Add Branch"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.branches}
      rows={branches.rows}
      loading={branches.loading}
      loadError={branches.error}
      optionSources={{ companies: companies.rows }}
      onAdd={branches.add}
      onEdit={branches.edit}
      onDelete={branches.remove}
      columns={[
        { key: 'name', label: 'Branch Name' },
        { key: 'companyName', label: 'Company' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function ProjectSetupPage() {
  const projects = useSetupResource('projects')

  return (
    <SetupListPage
      title="Project Setup"
      description="Manage customer projects."
      breadcrumbs={['Setup', 'Project Setup']}
      actionLabel="+ Add Project"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.projects}
      rows={projects.rows}
      loading={projects.loading}
      loadError={projects.error}
      onAdd={projects.add}
      onEdit={projects.edit}
      onDelete={projects.remove}
      columns={[
        { key: 'name', label: 'Project Name' },
        { key: 'address', label: 'Address' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function PositionSetupPage() {
  const positions = useSetupResource('positions')

  return (
    <SetupListPage
      title="Position Setup"
      description="Manage employee positions."
      breadcrumbs={['Setup', 'Position Setup']}
      actionLabel="+ Add Position"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.positions}
      rows={positions.rows}
      loading={positions.loading}
      loadError={positions.error}
      onAdd={positions.add}
      onEdit={positions.edit}
      onDelete={positions.remove}
      columns={[
        { key: 'name', label: 'Position' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function CategorySetupPage() {
  const categories = useSetupResource('categories')

  return (
    <SetupListPage
      title="Category Setup"
      description="Manage product categories."
      breadcrumbs={['Setup', 'Category']}
      actionLabel="+ Add Category"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.categories}
      rows={categories.rows}
      loading={categories.loading}
      loadError={categories.error}
      onAdd={categories.add}
      onEdit={categories.edit}
      onDelete={categories.remove}
      columns={[
        { key: 'code', label: 'Category Code' },
        { key: 'name', label: 'Category Name' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function BrandSetupPage() {
  const brands = useSetupResource('brands')

  return (
    <SetupListPage
      title="Brand Setup"
      description="Manage product brands."
      breadcrumbs={['Setup', 'Brand']}
      actionLabel="+ Add Brand"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.brands}
      rows={brands.rows}
      loading={brands.loading}
      loadError={brands.error}
      onAdd={brands.add}
      onEdit={brands.edit}
      onDelete={brands.remove}
      columns={[
        { key: 'code', label: 'Brand Code' },
        { key: 'name', label: 'Brand Name' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function ModelSetupPage() {
  const models = useSetupResource('models')
  const brands = useSetupResource('brands')

  return (
    <SetupListPage
      title="Model Setup"
      description="Manage product models linked to brands."
      breadcrumbs={['Setup', 'Model']}
      actionLabel="+ Add Model"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.models}
      rows={models.rows}
      loading={models.loading}
      loadError={models.error}
      optionSources={{ brands: brands.rows }}
      onAdd={models.add}
      onEdit={models.edit}
      onDelete={models.remove}
      columns={[
        { key: 'brand', label: 'Brand' },
        { key: 'name', label: 'Model Name' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function UnitMeasureSetupPage() {
  const units = useSetupResource('units')

  return (
    <SetupListPage
      title="Unit of Measure Setup"
      description="Manage units of measure."
      breadcrumbs={['Setup', 'Unit Measure']}
      actionLabel="+ Add Unit"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.units}
      rows={units.rows}
      loading={units.loading}
      loadError={units.error}
      onAdd={units.add}
      onEdit={units.edit}
      onDelete={units.remove}
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Unit Name' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function ItemSetupPage() {
  const items = useSetupResource('items')
  const brands = useSetupResource('brands')
  const models = useSetupResource('models')
  const units = useSetupResource('units')

  return (
    <SetupListPage
      title="Item Setup"
      description="Product catalog with live stock on hand."
      breadcrumbs={['Setup', 'Item']}
      actionLabel="+ Add Item"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.items}
      rows={items.rows}
      loading={items.loading}
      loadError={items.error}
      optionSources={{
        brands: brands.rows,
        models: models.rows,
        units: units.rows,
      }}
      onAdd={items.add}
      onEdit={items.edit}
      onDelete={items.remove}
      columns={[
        { key: 'code', label: 'Item Code' },
        { key: 'brand', label: 'Brand' },
        { key: 'model', label: 'Model' },
        { key: 'name', label: 'Item Name' },
        { key: 'unit', label: 'Unit' },
        { key: 'stock', label: 'Stock on hand' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function SupplierSetupPage() {
  const suppliers = useSetupResource('suppliers')

  return (
    <SetupListPage
      title="Supplier Setup"
      description="Manage supplier master records."
      breadcrumbs={['Setup', 'Supplier']}
      actionLabel="+ Add Supplier"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.suppliers}
      rows={suppliers.rows}
      loading={suppliers.loading}
      loadError={suppliers.error}
      onAdd={suppliers.add}
      onEdit={suppliers.edit}
      onDelete={suppliers.remove}
      columns={[
        { key: 'code', label: 'Supplier Code' },
        { key: 'name', label: 'Supplier Name' },
        { key: 'contact', label: 'Contact Person' },
        { key: 'phone', label: 'Contact No.' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}

export function CustomerSetupPage() {
  const customers = useSetupResource('customers')

  return (
    <SetupListPage
      title="Customer Setup"
      description="Manage customer master records."
      breadcrumbs={['Setup', 'Customer']}
      actionLabel="+ Add Customer"
      rowIdKey="id"
      formFields={SETUP_FORM_FIELDS.customers}
      rows={customers.rows.map((customer) => ({
        ...customer,
        termsDisplay: formatCustomerTerms(customer),
      }))}
      loading={customers.loading}
      loadError={customers.error}
      onAdd={customers.add}
      onEdit={customers.edit}
      onDelete={customers.remove}
      columns={[
        { key: 'code', label: 'Customer Code' },
        { key: 'name', label: 'Customer Name' },
        { key: 'address', label: 'Address' },
        { key: 'tin', label: 'TIN' },
        { key: 'termsDisplay', label: 'Terms' },
        { key: 'status', label: 'Status' },
      ]}
    />
  )
}
