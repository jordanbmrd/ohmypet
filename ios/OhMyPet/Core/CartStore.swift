import SwiftUI

/// Holds the cart line items for the session. Adding the same product + variant +
/// artwork merges quantities rather than creating duplicate lines.
@MainActor
final class CartStore: ObservableObject {
    @Published private(set) var items: [CartItem] = []

    var count: Int { items.reduce(0) { $0 + $1.quantity } }
    var isEmpty: Bool { items.isEmpty }
    var subtotalCents: Int { items.reduce(0) { $0 + $1.lineTotalCents } }

    func add(_ item: CartItem) {
        if let index = items.firstIndex(where: { $0.matches(item) }) {
            items[index].quantity += item.quantity
        } else {
            items.append(item)
        }
    }

    func setQuantity(_ quantity: Int, for item: CartItem) {
        guard let index = items.firstIndex(where: { $0.id == item.id }) else { return }
        if quantity <= 0 {
            items.remove(at: index)
        } else {
            items[index].quantity = quantity
        }
    }

    func remove(_ item: CartItem) {
        items.removeAll { $0.id == item.id }
    }

    func clear() {
        items.removeAll()
    }
}
