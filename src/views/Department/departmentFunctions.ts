// departmentFunctions.ts

import { ref } from 'vue';
import { getDepartmentListApi } from '@/api/departmentApi';
import type { DepartmentRequest, Department } from '@/api/departmentApi';

export const departments = ref<Department[]>([]);
export const listLoading = ref<boolean>(false);
export const page = ref<number>(1);

export const handleQuery = async (filters: { name: string }) => {
    const para = ref<DepartmentRequest>({
        page: page.value,
        f: '0',
        key: filters.name,
    });

    listLoading.value = true;
    try {
        const { response } = await getDepartmentListApi(para.value);
        departments.value = response ?? [];
    } finally {
        listLoading.value = false;
    }
};