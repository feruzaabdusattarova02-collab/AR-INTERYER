
AFRAME.registerComponent("hit-test", {
    init: function () {
        this.reticle = document.querySelector("#reticle");
        this.hitTestSource = null;
        this.referenceSpace = null;
        this.session = null;

        this.el.addEventListener("enter-vr", () => {
            this.startHitTest();
        });
    },

    startHitTest: async function () {
        try {
            const renderer = this.el.renderer;
            this.session = renderer.xr.getSession();

            if (!this.session) return;

            const viewerSpace =
                await this.session.requestReferenceSpace("viewer");

            this.referenceSpace =
                await this.session.requestReferenceSpace("local");

            this.hitTestSource =
                await this.session.requestHitTestSource({
                    space: viewerSpace
                });

            this.session.addEventListener("end", () => {
                this.hitTestSource = null;
                this.reticle.setAttribute("visible", false);
            });

        } catch (error) {
            console.error("Hit-test xatosi:", error);
        }
    },

    tick: function () {
        if (!this.hitTestSource || !this.session) return;

        const frame = this.el.renderer.xr.getFrame();

        if (!frame) return;

        const results = frame.getHitTestResults(
            this.hitTestSource
        );

        if (results.length > 0) {
            const pose = results[0].getPose(
                this.referenceSpace
            );

            this.reticle.object3D.visible = true;

            this.reticle.object3D.matrix.fromArray(
                pose.transform.matrix
            );

            this.reticle.object3D.matrix.decompose(
                this.reticle.object3D.position,
                this.reticle.object3D.quaternion,
                this.reticle.object3D.scale
            );

        } else {
            this.reticle.object3D.visible = false;
        }
    }
});
