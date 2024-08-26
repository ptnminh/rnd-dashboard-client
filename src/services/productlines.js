import { filter, isEmpty, keys, omit } from "lodash";
import { showNotification } from "../utils/index";
import apiClient from "./axiosClient";


export const productlineService = {
    createBatchProductlines: async (payload) => {
        try {
            const { data: result } = await apiClient.post(
                `/new-product-line-briefs/create-batch`,
                payload
            );
            if (result?.success === false) {
                if (result?.code === 403) {
                    showNotification(
                        "Thất bại",
                        "Bạn không có quyền thực hiện hành động này",
                        "red"
                    );
                } else {
                    showNotification(
                        "Thất bại",
                        result?.message || "Tạo brief thất bại",
                        "red"
                    );
                }
                return false;
            }
            return result;
        } catch (error) {
            const code = error?.response?.data?.code;
            if (code === 403) {
                showNotification(
                    "Thất bại",
                    "Bạn không có quyền thực hiện hành động này",
                    "red"
                );
            } else {
                console.log("Error at fetchQuotes:", error);
                showNotification("Thất bại", "Tạo caption thất bại", "red");
            }
            return false;
        }
    },
    fetchTask: async ({ page, limit, query, view }) => {
        try {
            let url = `/new-product-line-briefs?page=${page}&pageSize=${limit}&view=${view}`;
            const queryKeys = keys(query);
            const transformedQuery = filter(queryKeys, (key) => query[key]);
            const emptyKeys = filter(queryKeys, (key) => !query[key]);
            if (!isEmpty(transformedQuery)) {
                const queryString = `filter=${encodeURIComponent(
                    JSON.stringify({
                        ...omit(query, emptyKeys),
                    })
                )}`;
                url = `${url}&${queryString}`;
            }
            const response = await apiClient.get(url);
            const { data: result } = response;
            if (result?.success === false) {
                return false;
            }
            return result;
        } catch (error) {
            console.log("Error at fetchProductLines:", error);
            return false;
        }
    },
    update: async ({
        uid,
        data,
    }) => {
        try {
            const response = await apiClient.put(
                `/new-product-line-briefs/${uid}/new-product-line`,
                data
            );
            const { data: result } = response;
            if (result?.success === false) {
                if (result?.code === 403) {
                    showNotification(
                        "Thất bại",
                        "Bạn không có quyền thực hiện hành động này",
                        "red"
                    );
                } else {
                    showNotification(
                        "Thất bại",
                        result?.message || "Cập nhật Brief thất bại",
                        "red"
                    );
                }
                return false;
            }
            return result;
        } catch (error) {
            const code = error?.response?.data?.code;
            if (code === 403) {
                showNotification(
                    "Thất bại",
                    "Bạn không có quyền thực hiện hành động này",
                    "red"
                );
            } else {
                console.log("Error at fetchQuotes:", error);
                showNotification("Thất bại", "Cập nhật Brief thất bại", "red");
            }
            return false;
        }
    },
    updateReadyToLaunch: async ({
        uid,
        data,
    }) => {
        try {
            const response = await apiClient.put(
                `/new-product-line-briefs/${uid}/ready-to-launch`,
                data
            );
            const { data: result } = response;
            if (result?.success === false) {
                if (result?.code === 403) {
                    showNotification(
                        "Thất bại",
                        "Bạn không có quyền thực hiện hành động này",
                        "red"
                    );
                } else {
                    showNotification(
                        "Thất bại",
                        result?.message || "Cập nhật Brief thất bại",
                        "red"
                    );
                }
                return false;
            }
            return result;
        } catch (error) {
            const code = error?.response?.data?.code;
            if (code === 403) {
                showNotification(
                    "Thất bại",
                    "Bạn không có quyền thực hiện hành động này",
                    "red"
                );
            } else {
                console.log("Error at fetchQuotes:", error);
                showNotification("Thất bại", "Cập nhật Brief thất bại", "red");
            }
            return false;
        }
    }
}