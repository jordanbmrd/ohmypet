import Foundation

/// A line in the cart: a product variant printed with a specific generated portrait.
struct CartItem: Identifiable, Hashable {
    let id: UUID
    let category: ProductCategory
    let variant: ProductVariant
    let imageURL: URL
    let themeTitle: String
    var quantity: Int

    init(
        id: UUID = UUID(),
        category: ProductCategory,
        variant: ProductVariant,
        imageURL: URL,
        themeTitle: String,
        quantity: Int = 1
    ) {
        self.id = id
        self.category = category
        self.variant = variant
        self.imageURL = imageURL
        self.themeTitle = themeTitle
        self.quantity = quantity
    }

    var unitPriceCents: Int { category.basePriceCents + variant.priceDeltaCents }
    var lineTotalCents: Int { unitPriceCents * quantity }

    /// Two lines refer to the same orderable unit when product + variant + artwork match.
    func matches(_ other: CartItem) -> Bool {
        category == other.category && variant == other.variant && imageURL == other.imageURL
    }
}
