const logFetchWarning = (label, err) => {
  const code = err?.cause?.code || err?.code;
  const message = err?.cause?.message || err?.message || "Unknown error";
  console.warn(`${label}: ${code ? `${code} - ` : ""}${message}`);
};

const getCmsCacheOptions = () =>
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { next: { revalidate: 60 * 60 * 24 * 30 } };

//get single post with slug
export const getSinglePostData = async (slug, apiRoute) => {


  try {
    const route = String(apiRoute || "").replace(/^\/+/, "");
    const url = `${process.env.url}/${route}?slug=${encodeURIComponent(slug)}&acf_format=standard`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
      ...getCmsCacheOptions(),
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    logFetchWarning("Unable to fetch post data", err);
    return null;
  }
};

// get single post data using post id
export const getSinglePostDataWithID = async (id, apiRoute) => {
  try {
    let response = await fetch(
      `${process.env.url}/${apiRoute}/${id}?acf_format=standard`,
      {
        ...getCmsCacheOptions(),
      },
    );

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    let data = await response.json();
    return data;
  } catch (err) {
    logFetchWarning("Unable to fetch post data by ID", err);
    return null;
  }
};

//get all posts
export const getAllPosts = async (apiRoute) => {
  try {
    let response = await fetch(
      `${process.env.url}/${apiRoute}?acf_format=standard&per_page=100`,
      {
        ...getCmsCacheOptions(),
      },
    );

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    let data = await response.json();
    return data;
  } catch (err) {
    logFetchWarning("Unable to fetch posts", err);
    return [];
  }
};

export const getOptions = async () => {
  try {
    let fetchData = await fetch(`${process.env.url}/wp-json/options/all`, {
      ...getCmsCacheOptions(),
    });

    if (!fetchData.ok) {
      throw new Error(`Fetch failed with status: ${fetchData.status}`);
    }

    let data = await fetchData.json();
    return data;
  } catch (err) {
    logFetchWarning("Unable to fetch options", err);
    return {};
  }
};

// get reivews
export const getGoogleReviews = async () => {
  const baseUrl = process.env.siteUrl; // Change this in production

  try {
    const res = await fetch(`${baseUrl}/api/google-reviews`, {
      next: { revalidate: 2592000 },
    });

    if (!res.ok) {
      console.log("failed to fetch");
      return [];
    }
    return res.json();
  } catch (err) {
    logFetchWarning("Unable to fetch Google reviews", err);
    return [];
  }
};

// get pick up addres
export const getHubspotContacts = async () => {
  const baseUrl = process.env.siteUrl; // Change this in production

  try {
    const res = await fetch(`${baseUrl}/api/hubspot/contacts?limit=100`, {
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      console.log("HubSpot API error:", { status: res.status, data });
      return [];
    }

    return data.results || [];
  } catch (err) {
    logFetchWarning("Unable to fetch HubSpot contacts", err);
    return [];
  }
};

const axios = require("axios");

if (process.env.TRIGGER_BRIGHTDATA_REVIEWS === "true") {
  const data = JSON.stringify([
    {
      url: "https://www.google.com/maps/place/Best+NZ+Movers/@-37.0505295,174.8591432,12z/data=!4m6!3m5!1s0x6d72ad599064635b:0x6c0ae0912c7f3416!8m2!3d-37.050558!4d174.9415442!16s%2Fg%2F11ybzp6jf6?hl=en-GB&authuser=0&entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoASAFQAw%3D%3D",
      days_limit: 18,
    },
  ]);

  axios
    .post(
      "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_luzfs1dn2oa0teb81&include_errors=true",
      data,
      {
        headers: {
          Authorization: "Bearer d5991053-4d54-4922-9482-5bab1d20f59c",
          "Content-Type": "application/json",
        },
      },
    )
    .then((response) => console.log(response.data))
    .catch((error) => logFetchWarning("Unable to trigger BrightData reviews", error));
}

export const getLongDistanceRoutes = async () => {
  try {
    let fetchData = await fetch(
      `${process.env.url}/wp-json/smart/v1/long-distance-moves`,
      {
        next: { revalidate: 2592000 },
      },
    );

    if (!fetchData.ok) {
      throw new Error(`Fetch failed with status: ${fetchData.status}`);
    }

    let data = await fetchData.json();
    return data;
  } catch (err) {
    logFetchWarning("Unable to fetch long distance routes", err);
    return [];
  }
};
