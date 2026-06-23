class HealthService:
    @staticmethod
    def check() -> dict:
        return {
            "success": True,
            "message": "API do ViSAGIO funcionando!",
            "project": "ViSAGIO"
        }
