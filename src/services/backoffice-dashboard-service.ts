import { API_BASE_URL } from "@/core/config";

export type DashboardKpis = {
  totalVisitors: number;
  totalClients: number;
  totalUsers: number;
  totalArtisans: number;
  ordersThisMonth: number;
  monthlyRevenue: number;
  currency: string;
};

export type RevenueTrendPoint = {
  month: string;
  value: number;
};

export type RevenueTrend = {
  period: string;
  growthVsPreviousPeriod: number;
  points: RevenueTrendPoint[];
};

export type CategorySegment = {
  label: string;
  value: number;
  color: string;
};

export type CategorySegments = {
  totalPercent: number;
  segments: CategorySegment[];
};

export type DashboardModule = {
  key: string;
  label: string;
  href: string;
};

export type DashboardOverview = {
  title: string;
  subtitle: string;
  modules: DashboardModule[];
};

async function parseApiError(response: Response): Promise<Error> {
  const fallback = "Impossible de charger le dashboard backoffice.";
  try {
    const payload = (await response.json()) as {
      message?: string;
      error?: { message?: string };
    };
    const message = payload.error?.message ?? payload.message ?? fallback;
    return new Error(message);
  } catch {
    return new Error(fallback);
  }
}

async function getJson<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw await parseApiError(response);
  }
  return response.json() as Promise<T>;
}

export class BackofficeDashboardService {
  getKpis(accessToken: string): Promise<DashboardKpis> {
    return getJson<DashboardKpis>("/v1/backoffice/dashboard/kpis", accessToken);
  }

  getRevenueTrend(accessToken: string, period = "9m"): Promise<RevenueTrend> {
    return getJson<RevenueTrend>(
      `/v1/backoffice/dashboard/revenue-trend?period=${encodeURIComponent(period)}`,
      accessToken,
    );
  }

  getCategorySegments(accessToken: string): Promise<CategorySegments> {
    return getJson<CategorySegments>(
      "/v1/backoffice/dashboard/category-segments",
      accessToken,
    );
  }

  getOverview(accessToken: string): Promise<DashboardOverview> {
    return getJson<DashboardOverview>("/v1/backoffice/dashboard/overview", accessToken);
  }
}
