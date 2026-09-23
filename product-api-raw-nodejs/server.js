const http = require("http");
const fs = require("fs");
const { validateProduct } = require("./utils/validation");
const { sendResponse } = require("./utils/response");

const PORT = 5000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url.startsWith("/products/")) {
    const id = req.url.split("/")[2];

    fs.readFile("./data/products.json", (err, data) => {
      if (err) {
        return sendResponse(res, 500, {
          success: false,
          message: "Failed to read products",
        });
      }

      const product = JSON.parse(data).find((p) => Number(p.id) === Number(id));

      if (!product) {
        return sendResponse(res, 404, {
          success: false,
          message: "Product not found",
        });
      }

      sendResponse(res, 200, {
        success: true,
        message: "Product fetched successfully",
        data: product,
      });
    });

    return;
  }

  if (req.method === "GET" && req.url.startsWith("/products")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const search = url.searchParams.get("search");
    const category = url.searchParams.get("category");
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const sort = url.searchParams.get("sort");
    const order = url.searchParams.get("order") || "asc";

    fs.readFile("./data/products.json", (err, data) => {
      if (err) {
        return sendResponse(res, 500, {
          success: false,
          message: "Failed to read products",
        });
      }

      let products = JSON.parse(data);

      if (search) {
        products = products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (category) {
        products = products.filter((p) => p.categoryId === Number(category));
      }

      // sorting
      if (sort === "name") {
        products.sort((a, b) => {
          return order === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        });
      }

      if (sort === "price") {
        products.sort((a, b) => {
          return order === "asc" ? a.price - b.price : b.price - a.price;
        });
      }

      // pagination
      const total = products.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedProducts = products.slice(startIndex, startIndex + limit);

      sendResponse(res, 200, {
        success: true,
        message: "Products fetched successfully",
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        data: paginatedProducts,
      });
    });
    return;
  }

  if (req.method === "POST" && req.url === "/products") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      let newProduct;
      try {
        newProduct = JSON.parse(body);
      } catch (err) {
        return sendResponse(res, 400, {
          success: false,
          message: "Invalid body",
        });
      }

      const errors = validateProduct(newProduct);

      if (Object.keys(errors).length > 0) {
        return sendResponse(res, 400, {
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      fs.readFile("./data/products.json", "utf-8", (err, data) => {
        if (err) {
          return sendResponse(res, 500, {
            success: false,
            message: "Failed to read products",
          });
        }

        const products = JSON.parse(data);
        const newId =
          products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = {
          id: newId,
          name: newProduct.name,
          price: newProduct.price,
          categoryId: newProduct.categoryId,
          stock: newProduct.stock,
        };

        products.push(product);

        fs.writeFile(
          "./data/products.json",
          JSON.stringify(products),
          (err) => {
            if (err) {
              return sendResponse(res, 500, {
                success: false,
                message: "Failed to create product",
              });
            }

            sendResponse(res, 201, {
              success: true,
              message: "Product created successfully",
              data: product,
            });
          },
        );
      });
    });

    return;
  }

  if (req.method === "PUT" && req.url.startsWith("/products/")) {
    const id = req.url.split("/")[2];

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      let updateData;
      try {
        updateData = JSON.parse(body);
      } catch (err) {
        return sendResponse(res, 400, {
          success: false,
          message: "Invalid JSON body",
        });
      }

      const errors = validateProduct(updateData);

      if (Object.keys(errors).length > 0) {
        return sendResponse(res, 400, {
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      fs.readFile("./data/products.json", "utf-8", (err, data) => {
        if (err) {
          return sendResponse(res, 500, {
            success: false,
            message: "Failed to read products",
          });
        }

        const products = JSON.parse(data);
        const index = products.findIndex((p) => Number(p.id) === Number(id));

        if (index === -1) {
          return sendResponse(res, 404, {
            success: false,
            message: "Product not found",
          });
        }

        const updatedProduct = {
          id: Number(id),
          name: updateData.name,
          price: updateData.price,
          categoryId: updateData.categoryId,
          stock: updateData.stock,
        };

        products[index] = updatedProduct;

        fs.writeFile(
          "./data/products.json",
          JSON.stringify(products, null, 2),
          (err) => {
            if (err) {
              return sendResponse(res, 500, {
                success: false,
                message: "Failed to update product",
              });
            }

            sendResponse(res, 200, {
              success: true,
              message: "Product updated successfully",
              data: updatedProduct,
            });
          },
        );
      });
    });

    return;
  }

  if (req.method === "PATCH" && req.url.startsWith("/products/")) {
    const id = req.url.split("/")[2];

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      let updateData;
      try {
        updateData = JSON.parse(body);
      } catch (error) {
        return sendResponse(res, 400, {
          success: false,
          message: "Invalid JSON body",
        });
      }

      fs.readFile("./data/products.json", "utf8", (error, data) => {
        if (error) {
          return sendResponse(res, 500, {
            success: false,
            message: "Failed to read products",
          });
        }

        const products = JSON.parse(data);

        const index = products.findIndex(
          (product) => product.id === Number(id),
        );

        if (index === -1) {
          return sendResponse(res, 404, {
            success: false,
            message: "Product not found",
          });
        }

        const updatedProduct = {
          ...products[index],
          ...updateData,
        };

        products[index] = updatedProduct;

        fs.writeFile(
          "./data/products.json",
          JSON.stringify(products, null, 2),
          (error) => {
            if (error) {
              return sendResponse(res, 500, {
                success: false,
                message: "Failed to update product",
              });
            }

            sendResponse(res, 200, {
              success: true,
              message: "Product updated successfully",
              data: updatedProduct,
            });
          },
        );
      });
    });

    return;
  }

  if (req.method === "DELETE" && req.url.startsWith("/products/")) {
    const id = req.url.split("/")[2];

    fs.readFile("./data/products.json", "utf-8", (err, data) => {
      if (err) {
        return sendResponse(res, 500, {
          success: false,
          message: "Failed to read products",
        });
      }

      const products = JSON.parse(data);
      const productExist = products.find((p) => Number(p.id) === Number(id));

      if (!productExist) {
        return sendResponse(res, 404, {
          success: false,
          message: "Product not found",
        });
      }

      const updatedProducts = products.filter(
        (p) => Number(p.id) !== Number(id),
      );

      fs.writeFile(
        "./data/products.json",
        JSON.stringify(updatedProducts, null, 2),
        (err) => {
          if (err) {
            return sendResponse(res, 500, {
              success: false,
              message: "Failed to delete product",
            });
          }

          sendResponse(res, 200, {
            success: true,
            message: "Product deleted successfully",
          });
        },
      );
    });

    return;
  }

  // Route not found
  sendResponse(res, 404, {
    success: false,
    message: "Route not found",
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
