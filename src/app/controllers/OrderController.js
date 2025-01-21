import * as Yup from 'yup';
import Category from '../models/Category';
import Product from '../models/Product';
import Order from '../schemas/Order';

class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { products } = request.body;

    const productsIds = products.map((product) => product.id);

    const findProducts = await Product.findAll({
      where: {
        id: productsIds,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    const formattedProducts = findProducts.map((product) => {
      const productsIndex = products.findIndex(
        (item) => item.id === product.id,
      );
      const newProducts = {
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        url: product.url,
        quantity: products[productsIndex].quantity,
      };

      return newProducts;
    });

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: formattedProducts,
      status: 'Pedido realizado',
    };

    const createdOrder = await Order.create(order);

    return response.status(201).json(createdOrder);
  }

  async index(request, response) {
    const orders = await Order.findAll();

    return response.json(orders);
  }

  async index(request, response) {
    const orders = await Order.find();
    return response.json(orders);
  }
}

export default new OrderController();
