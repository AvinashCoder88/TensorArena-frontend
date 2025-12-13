export type Point = { x: number; y: number; label?: number }; // Label 0 or 1 for classification
export type Cluster = { x: number; y: number; label: number };
export type ModelType = 'logistic' | 'knn' | 'kmeans';

export interface TrainingResult {
    modelType: ModelType;
    weights?: { w1: number; w2: number; b: number }; // For Logistic
    decisionBoundary?: { x: number; y: number; label: number }[]; // For KNN visualization
    centroids?: { x: number; y: number; label: number }[]; // For K-Means
    clusters?: Point[]; // Points with assigned labels for K-Means
    logs: string[];
}

// Helper: Sigmoid function
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

/**
 * Logistic Regression
 * Simple Gradient Descent implementation
 */
export const trainLogisticRegression = async (
    points: Point[],
    learningRate: number = 0.1,
    epochs: number = 100
): Promise<TrainingResult> => {
    let w1 = Math.random() - 0.5;
    let w2 = Math.random() - 0.5;
    let b = Math.random() - 0.5;
    const logs: string[] = [];

    // Simple normalization to keep gradients stable if inputs are large (0-100 typical)
    for (let i = 0; i < epochs; i++) {
        let dw1 = 0, dw2 = 0, db = 0;

        points.forEach(p => {
            const z = w1 * p.x + w2 * p.y + b;
            const h = sigmoid(z);
            const y = p.label || 0; // Default to 0 if undefined

            // Gradients
            const err = h - y;
            dw1 += err * p.x;
            dw2 += err * p.y;
            db += err;
        });

        const m = points.length;
        w1 -= (learningRate * dw1) / m;
        w2 -= (learningRate * dw2) / m;
        b -= (learningRate * db) / m;
    }

    logs.push(`Final weights: w1=${w1.toFixed(4)}, w2=${w2.toFixed(4)}, b=${b.toFixed(4)}`);

    return {
        modelType: 'logistic',
        weights: { w1, w2, b },
        logs
    };
};

/**
 * K-Nearest Neighbors
 * Returns a grid of points classified by the algorithm for visualization
 */
export const runKNN = async (
    trainPoints: Point[],
    k: number = 3,
    gridSize: number = 20, // Resolution of decision boundary
    xRange: [number, number] = [0, 100],
    yRange: [number, number] = [0, 100]
): Promise<TrainingResult> => {
    const decisionBoundary: { x: number; y: number; label: number }[] = [];
    const logs: string[] = [`Running KNN with k=${k}...`];

    // Create grid
    const xStep = (xRange[1] - xRange[0]) / gridSize;
    const yStep = (yRange[1] - yRange[0]) / gridSize;

    for (let x = xRange[0]; x <= xRange[1]; x += xStep) {
        for (let y = yRange[0]; y <= yRange[1]; y += yStep) {
            // Find k nearest neighbors
            const neighbors = trainPoints
                .map(p => ({
                    ...p,
                    dist: Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2))
                }))
                .sort((a, b) => a.dist - b.dist)
                .slice(0, k);

            // Vote
            const votes = neighbors.reduce((acc, curr) => {
                acc[curr.label || 0] = (acc[curr.label || 0] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

            // Argmax
            let predictedLabel = 0;
            let maxVotes = -1;
            Object.entries(votes).forEach(([label, count]) => {
                if (count > maxVotes) {
                    maxVotes = count;
                    predictedLabel = parseInt(label);
                }
            });

            decisionBoundary.push({ x, y, label: predictedLabel });
        }
    }

    return {
        modelType: 'knn',
        decisionBoundary,
        logs
    };
};

/**
 * K-Means Clustering
 * Lloyd's Algorithm
 */
export const runKMeans = async (
    points: Point[],
    k: number = 3,
    iterations: number = 10
): Promise<TrainingResult> => {
    // 1. Initialize Centroids randomly
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    // Ensure we have some points to avoid infinity
    if (points.length === 0) return { modelType: 'kmeans', centroids: [], clusters: [], logs: ['No data points!'] };

    let centroids = Array.from({ length: k }).map((_, i) => ({
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY),
        label: i // Cluster ID
    }));

    const logs: string[] = [`Initialized ${k} centroids.`];
    let assignedPoints: Point[] = [];

    for (let iter = 0; iter < iterations; iter++) {
        // 2. Assignment Step
        assignedPoints = points.map(p => {
            let minDist = Infinity;
            let label = -1;
            centroids.forEach(c => {
                const dist = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
                if (dist < minDist) {
                    minDist = dist;
                    label = c.label;
                }
            });
            return { ...p, label };
        });

        // 3. System Update Step (Re-center centroids)
        let changed = false;
        const newCentroids = centroids.map(c => {
            const clusterPoints = assignedPoints.filter(p => p.label === c.label);
            if (clusterPoints.length === 0) return c; // Handle empty cluster

            const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
            const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;

            if (Math.abs(avgX - c.x) > 0.01 || Math.abs(avgY - c.y) > 0.01) changed = true;

            return { ...c, x: avgX, y: avgY };
        });

        centroids = newCentroids;
        if (!changed) {
            logs.push(`Converged at iteration ${iter + 1}`);
            break;
        }
    }

    return {
        modelType: 'kmeans',
        centroids,
        clusters: assignedPoints,
        logs
    };
};
