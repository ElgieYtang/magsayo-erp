import { nextSequentialCode, nextUserId, slugId } from '@/lib/setupHelpers'

function withActiveStatus(data) {
  return { ...data, status: data.status ?? 'Active' }
}

function deactivateByKey(list, key, id) {
  return list.map((item) => (item[key] === id ? { ...item, status: 'Inactive' } : item))
}

export function createSetupMutations(setState) {
  return {
    addSetupUser: (data) => {
      setState((prev) => ({
        ...prev,
        setupUsers: [
          ...prev.setupUsers,
          withActiveStatus({
            id: nextUserId(prev.setupUsers),
            name: data.name,
            username: data.username,
            type: data.type,
            position: data.position || '—',
            branch: data.branch,
          }),
        ],
      }))
    },
    updateSetupUser: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupUsers: prev.setupUsers.map((user) => {
          if (user.id !== id) return user

          const { password, ...rest } = data

          return {
            ...user,
            ...rest,
            ...(password ? { password } : {}),
          }
        }),
      }))
    },
    deactivateSetupUser: (id) => {
      setState((prev) => ({
        ...prev,
        setupUsers: deactivateByKey(prev.setupUsers, 'id', id),
      }))
    },

    addSetupCompany: (data) => {
      setState((prev) => ({
        ...prev,
        setupCompanies: [
          ...prev.setupCompanies,
          withActiveStatus({
            id: String(Date.now()),
            name: data.name,
            address: data.address,
            contactNo: data.contactNo || '',
            tinNo: data.tinNo || '',
          }),
        ],
      }))
    },
    updateSetupCompany: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupCompanies: prev.setupCompanies.map((company) =>
          company.id === id ? { ...company, ...data } : company,
        ),
      }))
    },
    deactivateSetupCompany: (id) => {
      setState((prev) => ({
        ...prev,
        setupCompanies: deactivateByKey(prev.setupCompanies, 'id', id),
      }))
    },

    addSetupBranch: (data) => {
      setState((prev) => ({
        ...prev,
        setupBranches: [...prev.setupBranches, withActiveStatus({ ...data })],
      }))
    },
    updateSetupBranch: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupBranches: prev.setupBranches.map((branch) =>
          branch.code === id ? { ...branch, ...data } : branch,
        ),
      }))
    },
    deactivateSetupBranch: (id) => {
      setState((prev) => ({
        ...prev,
        setupBranches: deactivateByKey(prev.setupBranches, 'code', id),
      }))
    },

    addSetupProject: (data) => {
      setState((prev) => ({
        ...prev,
        setupProjects: [...prev.setupProjects, withActiveStatus({ ...data })],
      }))
    },
    updateSetupProject: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupProjects: prev.setupProjects.map((project) =>
          project.code === id ? { ...project, ...data } : project,
        ),
      }))
    },
    deactivateSetupProject: (id) => {
      setState((prev) => ({
        ...prev,
        setupProjects: deactivateByKey(prev.setupProjects, 'code', id),
      }))
    },

    addSetupPosition: (data) => {
      setState((prev) => ({
        ...prev,
        setupPositions: [...prev.setupPositions, withActiveStatus({ ...data })],
      }))
    },
    updateSetupPosition: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupPositions: prev.setupPositions.map((position) =>
          position.name === id ? { ...position, ...data } : position,
        ),
      }))
    },
    deactivateSetupPosition: (id) => {
      setState((prev) => ({
        ...prev,
        setupPositions: deactivateByKey(prev.setupPositions, 'name', id),
      }))
    },

    addSetupCategory: (data) => {
      setState((prev) => ({
        ...prev,
        setupCategories: [...prev.setupCategories, withActiveStatus({ ...data })],
      }))
    },
    updateSetupCategory: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupCategories: prev.setupCategories.map((category) =>
          category.code === id ? { ...category, ...data } : category,
        ),
      }))
    },
    deactivateSetupCategory: (id) => {
      setState((prev) => ({
        ...prev,
        setupCategories: deactivateByKey(prev.setupCategories, 'code', id),
      }))
    },

    addSetupBrand: (data) => {
      setState((prev) => ({
        ...prev,
        setupBrands: [...prev.setupBrands, withActiveStatus({ ...data })],
      }))
    },
    updateSetupBrand: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupBrands: prev.setupBrands.map((brand) =>
          brand.code === id ? { ...brand, ...data } : brand,
        ),
      }))
    },
    deactivateSetupBrand: (id) => {
      setState((prev) => ({
        ...prev,
        setupBrands: deactivateByKey(prev.setupBrands, 'code', id),
      }))
    },

    addSetupModel: (data) => {
      setState((prev) => ({
        ...prev,
        setupModels: [...prev.setupModels, withActiveStatus({ ...data })],
      }))
    },
    updateSetupModel: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupModels: prev.setupModels.map((model) =>
          `${model.brand}-${model.name}` === id ? { ...model, ...data } : model,
        ),
      }))
    },
    deactivateSetupModel: (id) => {
      setState((prev) => ({
        ...prev,
        setupModels: prev.setupModels.map((model) =>
          `${model.brand}-${model.name}` === id ? { ...model, status: 'Inactive' } : model,
        ),
      }))
    },

    addSetupUnit: (data) => {
      setState((prev) => ({
        ...prev,
        setupUnits: [...prev.setupUnits, withActiveStatus({ ...data })],
      }))
    },
    updateSetupUnit: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupUnits: prev.setupUnits.map((unit) =>
          unit.code === id ? { ...unit, ...data } : unit,
        ),
      }))
    },
    deactivateSetupUnit: (id) => {
      setState((prev) => ({
        ...prev,
        setupUnits: deactivateByKey(prev.setupUnits, 'code', id),
      }))
    },

    addSetupItem: (data) => {
      setState((prev) => ({
        ...prev,
        setupItems: [
          ...prev.setupItems,
          withActiveStatus({
            ...data,
            category: data.category || '—',
            description: data.description || '',
          }),
        ],
      }))
    },
    updateSetupItem: (id, data) => {
      setState((prev) => ({
        ...prev,
        setupItems: prev.setupItems.map((item) =>
          item.code === id ? { ...item, ...data } : item,
        ),
      }))
    },
    deactivateSetupItem: (id) => {
      setState((prev) => ({
        ...prev,
        setupItems: deactivateByKey(prev.setupItems, 'code', id),
      }))
    },

    addSupplier: (data) => {
      setState((prev) => ({
        ...prev,
        suppliers: [
          ...prev.suppliers,
          {
            id: `sup-${slugId(data.code)}`,
            code: data.code,
            name: data.name,
            contactPerson: data.contact || '',
            phone: data.phone || '',
            email: data.email || '',
            status: 'Active',
          },
        ],
      }))
    },
    updateSupplier: (id, data) => {
      setState((prev) => ({
        ...prev,
        suppliers: prev.suppliers.map((supplier) =>
          supplier.id === id
            ? {
                ...supplier,
                code: data.code,
                name: data.name,
                contactPerson: data.contact || '',
                phone: data.phone || '',
                email: data.email || '',
              }
            : supplier,
        ),
      }))
    },
    deactivateSupplier: (id) => {
      setState((prev) => ({
        ...prev,
        suppliers: prev.suppliers.map((supplier) =>
          supplier.id === id ? { ...supplier, status: 'Inactive' } : supplier,
        ),
      }))
    },

    addCustomer: (data) => {
      setState((prev) => ({
        ...prev,
        customers: [
          ...prev.customers,
          {
            id: `cust-${slugId(data.code)}`,
            code: data.code,
            name: data.name,
            contactPerson: '',
            phone: '',
            email: '',
            address: data.address || '',
            tinNo: data.tin || '',
            terms: data.terms || '',
            status: 'Active',
          },
        ],
      }))
    },
    updateCustomer: (id, data) => {
      setState((prev) => ({
        ...prev,
        customers: prev.customers.map((customer) =>
          customer.id === id
            ? {
                ...customer,
                code: data.code,
                name: data.name,
                address: data.address || '',
                tinNo: data.tin || '',
                terms: data.terms || '',
              }
            : customer,
        ),
      }))
    },
    deactivateCustomer: (id) => {
      setState((prev) => ({
        ...prev,
        customers: prev.customers.map((customer) =>
          customer.id === id ? { ...customer, status: 'Inactive' } : customer,
        ),
      }))
    },
  }
}
