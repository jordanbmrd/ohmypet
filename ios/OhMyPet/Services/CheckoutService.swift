import Foundation

/// Turns a cart into a checkout URL. The current implementation is a stub; the real
/// one will talk to Shopify (see `ShopifyCheckoutProvider` notes below).
protocol CheckoutProvider {
    func startCheckout(items: [CartItem]) async throws -> URL
}

enum CheckoutError: LocalizedError {
    case comingSoon
    case emptyCart

    var errorDescription: String? {
        switch self {
        case .comingSoon:
            "La commande en ligne arrive très bientôt. Vos articles sont conservés dans le panier."
        case .emptyCart:
            "Votre panier est vide."
        }
    }
}

/// Placeholder provider used until Shopify is wired. Validates the cart and reports
/// that checkout is not yet available, without touching the network.
struct StubCheckoutProvider: CheckoutProvider {
    func startCheckout(items: [CartItem]) async throws -> URL {
        guard !items.isEmpty else { throw CheckoutError.emptyCart }
        throw CheckoutError.comingSoon
    }
}

// MARK: - Shopify integration (future)
//
// When ready, add a `ShopifyCheckoutProvider: CheckoutProvider` that:
//   1. Maps each `CartItem` to a Shopify variant via `item.variant.shopifyVariantId`
//      (a Storefront variant GID, e.g. "gid://shopify/ProductVariant/123").
//   2. Calls the Storefront API `cartCreate` mutation with those merchandise IDs +
//      quantities, attaching the generated portrait URL as a line-item attribute so
//      fulfilment knows which artwork to print.
//   3. Returns the `cart.checkoutUrl` from the response.
// CartView then opens that URL in an in-app `SFSafariViewController` (SafariView).
// Credentials (Storefront domain + access token) belong in Config/Secrets.plist —
// none are added now.
