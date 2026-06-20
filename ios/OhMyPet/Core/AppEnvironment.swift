import Foundation

/// Reads configuration from the bundled `Secrets.plist`.
enum AppEnvironment {
    private static let config: [String: Any] = {
        guard
            let url = Bundle.main.url(forResource: "Secrets", withExtension: "plist"),
            let data = try? Data(contentsOf: url),
            let plist = try? PropertyListSerialization.propertyList(from: data, format: nil),
            let dict = plist as? [String: Any]
        else {
            return [:]
        }
        return dict
    }()

    static var apiBaseURL: URL {
        let raw = config["ApiBaseURL"] as? String ?? ""
        guard let url = URL(string: raw), !raw.contains("REPLACE_ME") else {
            fatalError("ApiBaseURL is not configured in Secrets.plist")
        }
        return url
    }

    static var shopifyDomain: String { config["ShopifyDomain"] as? String ?? "" }
    static var shopifyStorefrontToken: String { config["ShopifyStorefrontToken"] as? String ?? "" }
}
