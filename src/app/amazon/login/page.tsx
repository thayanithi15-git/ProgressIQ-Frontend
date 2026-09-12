"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Store,
} from "lucide-react";

/*
 * ---------------------------------------------------------
 * Callback outcome messages
 * ---------------------------------------------------------
 *
 * The backend redirects here with ?amazon=error&reason=<code>
 * after /amazon/callback finishes. Anything not listed falls
 * back to the raw reason so nothing is silently swallowed.
 */
const ERROR_MESSAGES: Record<string, string> = {
  access_denied:
    "You declined the authorization on Amazon. Nothing was connected.",

  missing_state:
    "Amazon did not return the authorization state. Please start again.",

  missing_selling_partner_id:
    "Amazon did not return a selling partner ID. Please start again.",

  missing_oauth_code:
    "Amazon did not return an authorization code. Please start again.",

  invalid_state:
    "The authorization request could not be verified. Please start again.",

  app_not_configured:
    "This Amazon application is not configured. Please contact support.",

  lwa_not_configured:
    "Amazon credentials are not configured. Please contact support.",

  redirect_uri_not_configured:
    "The Amazon redirect URI is not configured. Please contact support.",

  no_refresh_token:
    "Amazon did not return a refresh token. Please try authorizing again.",

  exchange_failed:
    "Amazon rejected the authorization code. Please try authorizing again.",

  storage_failed:
    "Your account was authorized but we could not save the connection. Please contact support.",
};

function normalizeRedirectUri(uri?: string): string {
  if (!uri) return "";
  return String(uri).trim();
}

type AccountType = "seller" | "vendor";

type CallbackResult =
  | { status: "success"; accountType: string; sellingPartnerId: string }
  | { status: "error"; message: string }
  | null;

export default function AmazonLogin() {
  const [selectedType, setSelectedType] = useState<AccountType>("seller");
  const [redirecting, setRedirecting] = useState(false);
  const [callbackResult, setCallbackResult] = useState<CallbackResult>(null);

  useEffect(() => {
    const resetRedirect = () => setRedirecting(false);

    window.addEventListener("pageshow", resetRedirect);
    window.addEventListener("focus", resetRedirect);

    return () => {
      window.removeEventListener("pageshow", resetRedirect);
      window.removeEventListener("focus", resetRedirect);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * Read the outcome of /amazon/callback
   * ---------------------------------------------------------
   *
   * The query string is stripped once it has been read so a
   * refresh does not keep showing a stale result.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const outcome = params.get("amazon");

    if (!outcome) {
      return;
    }

    if (outcome === "success") {
      const accountType = params.get("account_type") || "seller";

      setCallbackResult({
        status: "success",
        accountType,
        sellingPartnerId: params.get("selling_partner_id") || "",
      });

      setSelectedType(accountType === "vendor" ? "vendor" : "seller");
    } else {
      const reason = params.get("reason") || "";

      setCallbackResult({
        status: "error",
        message:
          ERROR_MESSAGES[reason] ||
          `Amazon authorization failed${reason ? ` (${reason})` : ""}.`,
      });
    }

    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  /*
   * ---------------------------------------------------------
   * Amazon configuration
   * ---------------------------------------------------------
   */

  const sellerClientId = String(
    process.env.NEXT_PUBLIC_AMAZON_CLIENT_ID || ""
  ).trim();

  const sellerState = String(
    process.env.NEXT_PUBLIC_AMAZON_STATE || ""
  ).trim();

  const vendorClientId = String(
    process.env.NEXT_PUBLIC_AMAZON_VENDOR_CLIENT_ID || ""
  ).trim();

  const vendorState = String(
    process.env.NEXT_PUBLIC_AMAZON_VENDOR_STATE || ""
  ).trim();

  // SAME redirect URI for Seller and Vendor
  const redirectUri = normalizeRedirectUri(
    process.env.NEXT_PUBLIC_AMAZON_REDIRECT_URI
  );

  /*
   * ---------------------------------------------------------
   * Validation
   * ---------------------------------------------------------
   */

  const validateConfig = (type: AccountType) => {
    if (!redirectUri) {
      console.error(
        "NEXT_PUBLIC_AMAZON_REDIRECT_URI is not configured"
      );

      alert(
        "Amazon redirect URI is not configured. Please contact support."
      );

      return false;
    }

    if (type === "seller") {
      if (!sellerClientId) {
        console.error(
          "NEXT_PUBLIC_AMAZON_CLIENT_ID is not configured"
        );

        alert(
          "Amazon Seller application is not configured. Please contact support."
        );

        return false;
      }

      if (!sellerState) {
        console.error(
          "NEXT_PUBLIC_AMAZON_STATE is not configured"
        );

        alert(
          "Amazon Seller state is not configured. Please contact support."
        );

        return false;
      }
    }

    if (type === "vendor") {
      if (!vendorClientId) {
        console.error(
          "NEXT_PUBLIC_AMAZON_VENDOR_CLIENT_ID is not configured"
        );

        alert(
          "Amazon Vendor application is not configured. Please contact support."
        );

        return false;
      }

      if (!vendorState) {
        console.error(
          "NEXT_PUBLIC_AMAZON_VENDOR_STATE is not configured"
        );

        alert(
          "Amazon Vendor state is not configured. Please contact support."
        );

        return false;
      }
    }

    return true;
  };

  /*
   * ---------------------------------------------------------
   * Amazon-initiated authorization (Appstore workflow)
   * ---------------------------------------------------------
   *
   * This page is registered as the app's OAuth Login URI, so
   * when a selling partner starts from Seller Central
   * ("Manage Your Apps" -> Authorize) Amazon opens it with:
   *
   *   amazon_callback_uri
   *   amazon_state
   *   selling_partner_id
   *
   * Amazon has already opened an authorization session at that
   * point. We must hand `amazon_state` straight back to
   * `amazon_callback_uri`; starting a fresh consent request
   * instead orphans that session, which is what Amazon reports
   * as MD6000 "the authorization session has expired".
   *
   * Draft apps additionally require `version=beta`.
   */
  const beginAmazonInitiatedFlow = ({
    amazonCallbackUri,
    amazonState,
    accountType,
  }: {
    amazonCallbackUri: string;
    amazonState: string;
    accountType: AccountType;
  }) => {
    const stateValue =
      accountType === "vendor"
        ? `${vendorState}:vendor`
        : `${sellerState}:seller`;

    const separator = amazonCallbackUri.includes("?") ? "&" : "?";

    const url =
      amazonCallbackUri +
      separator +
      `redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&amazon_state=${encodeURIComponent(amazonState)}` +
      `&state=${encodeURIComponent(stateValue)}` +
      `&version=beta`;

    console.log("[Amazon OAuth] Continuing Amazon-initiated authorization:", {
      accountType,
      amazonCallbackUri,
      redirectUri,
      state: stateValue,
    });

    window.location.href = url;
  };

  /*
   * The account type is not passed by Amazon, but the callback
   * URI carries the application id that the partner is
   * authorizing, so match it against the two configured apps.
   */
  const detectAccountType = (amazonCallbackUri: string): AccountType => {
    if (vendorClientId && amazonCallbackUri.includes(vendorClientId)) {
      return "vendor";
    }

    if (sellerClientId && amazonCallbackUri.includes(sellerClientId)) {
      return "seller";
    }

    return /vendorcentral/i.test(amazonCallbackUri) ? "vendor" : "seller";
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const amazonCallbackUri = params.get("amazon_callback_uri");
    const amazonState = params.get("amazon_state");

    if (!amazonCallbackUri || !amazonState) {
      return;
    }

    if (!redirectUri) {
      console.error("NEXT_PUBLIC_AMAZON_REDIRECT_URI is not configured");

      setCallbackResult({
        status: "error",
        message:
          "Amazon redirect URI is not configured. Please contact support.",
      });

      return;
    }

    const accountType = detectAccountType(amazonCallbackUri);

    setSelectedType(accountType);
    setRedirecting(true);

    beginAmazonInitiatedFlow({
      amazonCallbackUri,
      amazonState,
      accountType,
    });
    // Runs once on mount; Amazon's parameters cannot change without a reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * ---------------------------------------------------------
   * Connect Amazon
   * ---------------------------------------------------------
   */

  const handleConnect = (type: AccountType) => {
    if (redirecting) {
      return;
    }

    if (!validateConfig(type)) {
      return;
    }

    setRedirecting(true);

    let clientId: string;
    let state: string;
    let authorizationUrl: string;

    if (type === "seller") {
      clientId = sellerClientId;

      // Backend will identify this as seller
      state = `${sellerState}:seller`;

      authorizationUrl =
        "https://sellercentral.amazon.in/apps/authorize/consent";
    } else {
      clientId = vendorClientId;

      // Backend will identify this as vendor
      state = `${vendorState}:vendor`;

      authorizationUrl =
        "https://www.vendorcentral.in/apps/authorize/consent";
    }

    const amazonAuthorizationUrl =
      authorizationUrl +
      `?application_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${encodeURIComponent(state)}` +
      `&version=beta`;

    console.log("[Amazon OAuth] Starting authorization:", {
      type,
      applicationId: clientId,
      redirectUri,
      state,
    });

    window.location.href = amazonAuthorizationUrl;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between font-poppins p-6 sm:p-8">
      {/* Header */}
      <header className="w-full flex items-center justify-start">
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/progress_iq.png"
            alt="EQ-REV Logo"
            className="h-8 sm:h-9 w-auto object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.includes("progress_iq.png")) {
                target.src = "/progress.png";
              }
            }}
          />

          <span className="text-lg font-bold text-gray-900 tracking-tight">
            EQ-REV
          </span>
        </a>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Connect Amazon Account
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Select your Amazon account type to authorize
            </p>
          </div>

          {/* Callback outcome */}
          {callbackResult && (
            <div
              className={`mb-5 flex items-start gap-2.5 rounded-lg border p-3 ${
                callbackResult.status === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {callbackResult.status === "success" ? (
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-green-600"
                />
              ) : (
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-600"
                />
              )}

              <div className="min-w-0">
                <p
                  className={`text-xs font-semibold ${
                    callbackResult.status === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {callbackResult.status === "success"
                    ? `${
                        callbackResult.accountType === "vendor"
                          ? "Vendor Central"
                          : "Seller Central"
                      } connected`
                    : "Authorization failed"}
                </p>

                <p
                  className={`mt-0.5 text-[11px] break-words ${
                    callbackResult.status === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {callbackResult.status === "success"
                    ? callbackResult.sellingPartnerId
                      ? `Selling Partner ID: ${callbackResult.sellingPartnerId}`
                      : "Your account has been connected successfully."
                    : callbackResult.message}
                </p>
              </div>
            </div>
          )}

          {/* Account Selection */}
          <div className="space-y-3 mb-6">

            {/* Seller Central */}
            <div
              onClick={() => {
                if (!redirecting) {
                  setSelectedType("seller");
                }
              }}
              className={`cursor-pointer flex items-center justify-between p-3.5 rounded-lg border-2 transition-all ${
                selectedType === "seller"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded flex items-center justify-center ${
                    selectedType === "seller"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Store size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Seller Central
                  </h3>

                  <p className="text-[11px] text-gray-500">
                    Marketplace (3P) Seller Account
                  </p>
                </div>
              </div>

              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedType === "seller"
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedType === "seller" && (
                  <Check size={10} strokeWidth={3} />
                )}
              </div>
            </div>

            {/* Vendor Central */}
            <div
              onClick={() => {
                if (!redirecting) {
                  setSelectedType("vendor");
                }
              }}
              className={`cursor-pointer flex items-center justify-between p-3.5 rounded-lg border-2 transition-all ${
                selectedType === "vendor"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded flex items-center justify-center ${
                    selectedType === "vendor"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Building2 size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Vendor Central
                  </h3>

                  <p className="text-[11px] text-gray-500">
                    Direct Supplier (1P) Account
                  </p>
                </div>
              </div>

              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedType === "vendor"
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedType === "vendor" && (
                  <Check size={10} strokeWidth={3} />
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleConnect(selectedType)}
            disabled={redirecting}
            className="w-full flex items-center justify-center gap-2 rounded bg-gray-900 hover:bg-black py-2.5 px-4 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-75"
          >
            {redirecting ? (
              <span>Redirecting to Amazon...</span>
            ) : (
              <>
                <span>
                  Authorize{" "}
                  {selectedType === "seller"
                    ? "Seller Central"
                    : "Vendor Central"}
                </span>

                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-gray-400">
        <span>
          &copy; 2026 EQ-REV &middot; Secure Amazon SP-API Authorization
        </span>
      </footer>
    </div>
  );
}
